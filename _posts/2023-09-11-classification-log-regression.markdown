---
layout: learning
title:  "Logistic Regression"
subtitle: "Binary Classification Task: Ads Purchases"
date:   2023-09-11 20:45:31 +0700
categories: ["edu"]
tags: ["classification", "regression"]
author: "Karie Moorman"
---


<h3 align='center'>Table of Contents</h3>
<div class='tbl'>
<ul style='display: flex; flex-wrap: row; gap: 30px; margin-left: 10px; justify-content: center;'>
<li><a href='#intro'>Overview</a></li>
<li><a href='#train'>Model Training</a></li>
<li><a href='#eval'>Model Evaluation</a></li>
<li><a href='#optimize'>Optimization</a></li>
<li><a href='#predict'>Prediction</a></li>
</ul>
</div>


--- 

<h3 id='intro' align='center'>Overview</h3>


Logistic regression is a type of classification algorithm using in machine learning tasks to produce categorical predictions. In logistic regression, we fit an 's'-shaped curve to the training data. The model is then evaluated on its ability to classify a set of test observations with a label/category, based on a computed probability.

In the example below, we'll build a binary classification model that optimally fits to the training data the following function: 
```
P(X) = 1 / (1 + e^(-β₀ - β₁X₁ - β₂X₂ - β₃X₃))
```

The output prediction of the model is interpreted as a probability: 

```
^y = {1,  if P(x) > .5
      0,  if P(x) ≤ .5}
```

For model evaluation, we'll use the following metrics: 

<b>Accuracy</b>: Proportion of predictions the model correctly predicts.
- (TP + TN) / (TP + TN + FP + FN)

<b>Precision</b>: Proportion of positive identifications that are actually correct (i.e., how often a postive prediction is correct).
- TP / (TP + FP)

<b>Recall</b>: Proportion of actual positives that are identified correctly (i.e., True-Positive Rate, Sensitivity).
- TP / (TP + FN)

<b>F1-Score</b>: The geometric or harmonic mean of precision and recall.
- 2((Precision * Recall) / (Precision + Recall))

<b>ROC</b>: Probability curve of TPR on FPR at different classification thresholds, illustrating how much the model is capable of distinguishing between classes.

<br>

--- 

<h3 id='train' align='center'>Model Training</h3>

Note: This example is also accessible in the form of a [Jupyter Notebook on Github](https://github.com/kariemoorman/didactic-diy/blob/main/tutorials/predictive_modeling/logistic_regression.ipynb).

#### Load Python packages  

We'll use Sci-kit Learn python package to perform the logistic regression classification task.  

```python
# Dataset Manipulation
import numpy as np
import pandas as pd

# Model Building & Evaluation
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, f1_score, accuracy_score
from sklearn.metrics import roc_curve, roc_auc_score, auc

# Visualization
import scikitplot as skplt
import matplotlib.pyplot as plt
import seaborn as sns
```

#### Pre-Process Data

- Read in dataset.

In this example, the dataset consists of UUID, gender, age, estimated salary, and whether an ad was purchased, for 400 users.

```python
data = pd.read_csv('Social_Network_Ads.csv')
```

```
    User ID  Gender  Age  EstimatedSalary  Purchased
0  15624510    Male   19            19000          0
1  15810944    Male   35            20000          0
2  15668575  Female   26            43000          0
3  15603246  Female   27            57000          0
4  15804002    Male   19            76000          0 
```

For this model, we'll assign `Gender`, `Age`, and `EstimatedSalary` as independent variables, and `Purchased` as the binary dependent variable.


- Code categorical variable `Gender`.

```python
def code_gender(gender):
    if gender == 'Male':
        return 0
    elif gender == 'Female':
        return 1
    else:
        return -1  # Handle other cases if needed

data['Gender_code'] = data['Gender'].apply(code_gender)
```

- Create train/test sets.

```python
X = df[['Gender_code', 'Age', 'EstimatedSalary']]
y = df[['Purchased']]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
```

#### Train Logistic Regression Model 

- Initialize model.

```python
model = LogisticRegression(C=1.0, class_weight=None, dual=False, fit_intercept=True,
                   intercept_scaling=1, l1_ratio=None, max_iter=100,
                   multi_class='ovr', n_jobs=None, penalty='l2', random_state=0,
                   solver='liblinear', tol=0.0001, verbose=0, warm_start=False)
```

- Train model.

```python
model.fit(X_train, y_train)
```

--- 

<h3 id='eval' align='center'>Model Evaluation</h3>

#### Evaluate Model Performance

```python
df = data[['Gender_code', 'Age', 'EstimatedSalary', 'Purchased']]
corr_matrix = np.corrcoef(df.values, rowvar=False)

plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, fmt=".2f", cmap="coolwarm", square=True, xticklabels=df.columns, yticklabels=df.columns)
plt.title("Correlation Heatmap")
plt.show()
```

<img src='/media/images/classification/correlation_matrix.png'>



```python
train_accuracy = model.score(X_train, y_train)
test_accuracy = model.score(X_test, y_test)

print('Accuracy on trainset:', train_accuracy)
print('Accuracy on testset:', test_accuracy)
```

```
Accuracy on trainset: 0.628125
Accuracy on testset: 0.7125
```

```python
# Extract Model Predictions and Prediction Probabilities
y_pred = model.predict(X_test)
y_pred_prob = model.predict_proba(X_test)[:, 1]
```

```python
# Confusion Matrix
conf_matrix = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:\n",conf_matrix, '\n')
# Extract values from the confusion matrix
TN = conf_matrix[0, 0]  # True negatives
FP = conf_matrix[0, 1]  # False positives
FN = conf_matrix[1, 0]  # False negatives
TP = conf_matrix[1, 1]  # True positives
# Calculate False Positive Rate (FPR), False Negative Rate (FNR), and True Negative Rate (TNR)
FPR = FP / (FP + TN)
FNR = FN / (FN + TP)
TNR = TN / (TN + FP)
print("False Positive Rate (FPR):", round(FPR, 2))
print("False Negative Rate (FNR):", round(FNR, 2))
print("True Negative Rate (TNR):", round(TNR, 2), '\n')

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy, '\n')

# Calculate ROC 
fpr, tpr, thresholds = roc_curve(y_test, y_pred_prob)
roc_auc = auc(fpr, tpr)
print('ROC:', roc_auc)

# Classification report
report = classification_report(y_test, y_pred)
print("Classification Report:\n", report)
```

```python
Confusion Matrix:
 [[56  2]
 [21  1]] 

False Positive Rate (FPR): 0.03
False Negative Rate (FNR): 0.95
True Negative Rate (TNR): 0.97 

Accuracy: 0.7125 

ROC: 0.2554858934169279
Classification Report:
               precision    recall  f1-score   support

           0       0.73      0.97      0.83        58
           1       0.33      0.05      0.08        22

    accuracy                           0.71        80
   macro avg       0.53      0.51      0.45        80
weighted avg       0.62      0.71      0.62        80
```

#### Visualize Model Performance

```python
y_pred_proba = model.predict_proba(X_test)
skplt.metrics.plot_roc(y_test, y_pred_proba)
plt.show()
```

<img src='/media/images/classification/roc_base_model.png'>

<br>

#### Summary of Findings

The current model is naive in that it predicts “no ad purchased” majority of the time, as evidenced in the inflated FNR (0.95) and low TPR (0.05). Because the model can identify True Negatives, and there exist few True Positives, the overall Accuracy metric value is inflated. The low F-1 score in the Purchased Ads class (0.08) signals inability to reliably predict purchase events. The small ROC value (0.25) signals inability to distinguish between classes. We consider this model "underfit."

<br>

--- 

<h3 id='optimize' align='center'>Model Optimization</h3>

To improve model performance, we'll try normalizing the data and tuning C hyperparameter.

#### Normalize EstimatedSalary and Age Values

```python
scaler = MinMaxScaler()
data['NormalizedSalary'] = scaler.fit_transform(data[['EstimatedSalary']])
data['NormalizedAge'] = scaler.fit_transform(data[['Age']])
```

#### Create Train/Test Sets

```python
X = df[['Gender_code', 'NormalizedAge', 'NormalizedSalary']]
y = df[['Purchased']]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
```

#### Tune C Hyperparameter Value Using Cross-Validation 

In Sci-kit Learn logistic regression, the C parameter is an important hyperparameter that controls the regularization strength of the algorithm. It is an inverse regularization metric, in that smaller values correspond to more regularization, while larger values correspond to less regularization. We'll use GridSearchCV to perform a grid search over a range of C values and find the optimal value that maximizes the model performance.

```python
# define the range of C values to search over
param_grid = {'C': [0.001, 0.01, 0.1, 1, 10, 100]}

# perform a grid search over the C values
cv = GridSearchCV(model, param_grid, cv=5)
cv.fit(X_train, y_train)

# print the best C value and corresponding score
print("Best C:", cv.best_params_['C'])
print("Best score:", cv.best_score_)
```

```python
Best C: 10
Best score: 0.828125
```

#### Initialize Model Using New C Hyperparameter Value

In addition to normalizing the data, we'll also update the C hyperparameter value to relax the regularization strength of the model, from 1.0 to 10.0.

```python
model = LogisticRegression(C=10.0, class_weight=None, dual=False, fit_intercept=True,
                   intercept_scaling=1, l1_ratio=None, max_iter=100,
                   multi_class='ovr', n_jobs=None, penalty='l2', random_state=0,
                   solver='liblinear', tol=0.0001, verbose=0, warm_start=False)
```

#### Train New Model on Normalized Dataset

```python
model.fit(X_train, y_train)
```

- Evaluate model performance.

```python
train_accuracy = model.score(X_train, y_train)
test_accuracy = model.score(X_test, y_test)

print('Accuracy on trainset:', train_accuracy)
print('Accuracy on testset:', test_accuracy)
```

```
Accuracy on trainset: 0.825
Accuracy on testset: 0.9125
```

```python
# Extract Model Predictions and Prediction Probabilities
y_pred = model.predict(X_test)
y_pred_prob = model.predict_proba(X_test)[:, 1]
```

```python
# Confusion Matrix
conf_matrix = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:\n",conf_matrix, '\n')
# Extract values from the confusion matrix
TN = conf_matrix[0, 0]  # True negatives
FP = conf_matrix[0, 1]  # False positives
FN = conf_matrix[1, 0]  # False negatives
TP = conf_matrix[1, 1]  # True positives
# Calculate False Positive Rate (FPR), False Negative Rate (FNR), and True Negative Rate (TNR)
FPR = FP / (FP + TN)
FNR = FN / (FN + TP)
TNR = TN / (TN + FP)
print("False Positive Rate (FPR):", round(FPR, 2))
print("False Negative Rate (FNR):", round(FNR, 2))
print("True Negative Rate (TNR):", round(TNR, 2), '\n')

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy, '\n')

# Calculate ROC 
fpr, tpr, thresholds = roc_curve(y_test, y_pred_prob)
roc_auc = auc(fpr, tpr)
print('ROC:', roc_auc)

# Classification report
report = classification_report(y_test, y_pred)
print("Classification Report:\n", report)
```

```python
Confusion Matrix:
 [[56  2]
 [ 5 17]] 

False Positive Rate (FPR): 0.03
False Negative Rate (FNR): 0.23
True Negative Rate (TNR): 0.97 

Accuracy: 0.9125 

ROC: 0.9788401253918495
Classification Report:
               precision    recall  f1-score   support

           0       0.92      0.97      0.94        58
           1       0.89      0.77      0.83        22

    accuracy                           0.91        80
   macro avg       0.91      0.87      0.89        80
weighted avg       0.91      0.91      0.91        80
```

#### Visualize Model Performance

```python
y_pred_proba = model.predict_proba(X_test)
skplt.metrics.plot_roc(y_test, y_pred_proba)
plt.show()
```

<img src='/media/images/classification/roc_optimized_model.png'>

<br>


#### Summary of Findings

The new model is now able to reliably predict both Purchased Ads and No-Purchased Ads outcomes, as evidenced by the decreased FNR (0.23) and increase in TPR (0.77). Model accuracy has increased (0.91). F1-score on the smaller Purchased Ads class has increased (0.83), signalling increase in predictive performance. The large ROC value (0.9788) signals ability to reliably distinguish between classes. 

Let's use the updated model to make predictions on novel data.

<br>

--- 

<h3 id='predict' align='center'>Model Predictions</h3>

#### Predict Whether New Users Would Purchase an Ad

- Person 1: Male, 30 years old, estimated salary of 90K.
- Person 2: Female, 40 years old, estimated salary of 120K.

```python
new_data = np.array([[0, 30, 90000], [1, 40, 120000]])
scaler = MinMaxScaler()
normalized_data = scaler.fit_transform(new_data)

predicted_class = model.predict(normalized_data)
predicted_probabilities = model.predict_proba(normalized_data)

print("- Person 1:", predicted_class[0], predicted_probabilities[0])
print("- Person 2:", predicted_class[1], predicted_probabilities[1])
```

#### Summary of Findings

The model predicts that Person 1 would not purchase an ad, while Person 2 would purchase an ad:
```
- Person 1: 0 [0.99745906 0.00254094]
- Person 2: 1 [0.00477346 0.99522654]
```

