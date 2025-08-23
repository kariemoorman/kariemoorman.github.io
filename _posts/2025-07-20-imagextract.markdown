---
layout: learning
title:  "ImagExtract"
subtitle: "Image Processing on MacOS"
summary: "A MacOS command-line application for extracting text, objects, and faces from image files using Apple Vision and CoreML APIs."
date:   2025-07-20 21:03:01 +0700
categories: ["edu"]
image: "https://github.com/kariemoorman/kariemoorman.github.io/blob/master/media/images/imagextract.png"
tags: ["image", "ocr", "object-detection", "face-detection"]
author: "Karie Moorman"
---


<h3 align='center'>Table of Contents</h3>
<div class='tbl'>
<ul style='display: flex; flex-wrap: row; gap: 30px; margin-left: 10px; justify-content: center;'>
<li><a href='#intro'>Overview</a></li>
<li><a href='#model'>Models</a></li>
<li><a href='#swift'>Compilation</a></li>
<li><a href='#example'>Example</a></li>
</ul>
</div>

--- 

<div class='page-conf'>
<h3 id='intro' align='center'>Overview</h3>
<p align='center'><img src='/media/images/imagextract.png' width='50%'></p>
<p align='center'>Github: <a href='https://github.com/kariemoorman/imagextract' target='_blank'>https://github.com/kariemoorman/imagextract</a></p>
<p>ImagExtract is a MacOS command-line application for extracting text, objects, and faces from image files using Apple Vision and CoreML APIs. Users provide an input image (JPG, PNG, TIFF, PDF) and extracted information is output in a directory.</p>
</div>


---

<h3 id='model' align='center'>Models</h3>


<h4>Apple Vision</h4>

Apple's computer vision framework providing high-level APIs for image analysis tasks like face detection, text recognition, and object tracking, optimized for iOS and macOS.

For this project we use two APIs:

 - Text OCR (VNRecognizeTextRequest)

 A Vision API request that performs optical character recognition (OCR) to extract printed or handwritten text from images or video frames.

 - Face Detection (VNFaceObservation)

 A Vision API request that returns one or more objects that represent detected faces in images, including bounding boxes and facial landmark information.

<h4>YOLOv5</h4>

YOLO models are real-time object detection models known for their speed and accuracy, often converted to Core ML for on-device detection tasks. For this project we use YOLOv5m for object detection tasks.


<h4>ResNet</h4>

ResNet is a deep convolutional neural network architecture known for its residual connections, widely used for image classification and feature extraction. For this project we use ResNet50 for object detection tasks.

<br>

--- 

<h3 id='swift' align='center'>Compilation</h3>

<h4>1. Create a Swift App</h4>

```bash
swift package init --type executable
```

File Structure shows creation of a manifest file (`Package.swift`) that defines the structure, dependencies and targets of the Swift app, a `Sources` subdirectory that contains `main.swift` (or your set of swift files), and a `Tests` subdirectory that contains application tests (e.g., `tests.swift`).

```bash
imagextract/
├── Package.swift
├── Sources/
│   └── imagextract/
│       └── main.swift  
└── Tests/
    └── imagextractTests/
        └── tests.swift
```

<h4>2. Compile Models</h4>

Core ML models (`.mlmodel`) allow apps to run models on-device, without internet connection. The uncompiled format contains model structure, metadata, I/Os, allowing developers ability to inspect, edit, and implement version control.

Swift apps require models be compiled from `.mlmodel` source models to `.mlmodelc` for optimal runtime use.

Make a subdirectory for the compiled models to reside:

```bash
mkdir Models
```

File structure will be as follows:

```bash
imagextract/
├── Package.swift
├── Sources/
│   └── imagextract/
│       └── main.swift  
├── Models/
└── Tests/
    └── imagextractTests/
        └── tests.swift
```

For each model, run the following command:

```bash
xcrun coremlc compile <MODELNAME>.mlmodel ./Models
```

<h4>3. Build Dev App for Debugging</h4>

```bash
swift build -c debug
```

Swift will compile the project into a debug binary, and place it in `.build/debug/imagextract.exe`.

To run the dev app:

```bash
swift run -c debug <image_filepath>
```


<h4>4. Build App for Release</h4>

```bash
swift build -c release
```

Swift will compile the project into a release binary, and place it in `.build/release/imagextract.exe`.

To run the dev app:

```bash
swift run -c release <image_filepath>
```

<h4>5. Compress App & Models</h4>

```bash
zip -r imagextract-version-XX-XX-XX.zip .build/release/imagextract Models
```

<p></p>

<br>

--- 

<h3 id='example' align='center'>Example</h3>

<h4>1. Install ImagExtract</h4>

```bash
curl -L https://github.com/kariemoorman/imagextract/raw/main/install.sh | bash
```

```bash
exec /bin/zsh 
```

<h4>2. Extract Image Information</h4>

```bash
imagextract test-image.png


[INFO] Subdirectory created at: /Users/usrnm/Documents/test-image

OCR: ✅
Face Detection: ✅
YOLO Object Detection: ✅
RESNET Object Detection: ✅

[INFO] Image Processing Task Complete.
```

<h4>3. View Results</h4>

- Input Image:

<img src='/media/images/test-image/image.png' width='60%'>

<br>

- Recognized Text: 

```bash
ROYALEDLE
Daity Paoquess
a couplete
Can you guess the card fRom
tuis pixetated image?
Search any card.."
Fireball
Activate Vindow
G
```

<br>

- Face Detection: 

<img src='/media/images/test-image/Face0.png'>

<br>
- YOLO Object Detection:

<div style="display: flex; flex-wrap: wrap; max-width: 400px;">
  <img src="/media/images/test-image/Object0.png" alt="Image 1" style="width: 50%;">
  <img src="/media/images/test-image/Object1.png" alt="Image 2" style="width: 50%;">
  <img src="/media/images/test-image/Object2.png" alt="Image 3" style="width: 50%;">
  <img src="/media/images/test-image/Object3.png" alt="Image 4" style="width: 50%;">
</div>

<br>
- ResNet Object Detection:


<div tabindex="0" style="height:200px; overflow:auto; border:1px solid #ccc; padding:10px;">
<pre>
Class: scoreboard, Confidence: 42.700195%
Class: gas pump, gasoline pump, petrol pump, island dispenser, Confidence: 24.523926%
Class: slot, one-armed bandit, Confidence: 10.717773%
Class: web site, website, internet site, site, Confidence: 4.8675537%
Class: cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM, Confidence: 4.333496%
Class: monitor, Confidence: 1.675415%
Class: vending machine, Confidence: 1.4045715%
Class: home theater, home theatre, Confidence: 0.9338379%
Class: screen, CRT screen, Confidence: 0.8468628%
Class: laptop, laptop computer, Confidence: 0.6565094%
Class: digital clock, Confidence: 0.5748749%
Class: analog clock, Confidence: 0.47416687%
Class: notebook, notebook computer, Confidence: 0.33626556%
Class: hand-held computer, hand-held microcomputer, Confidence: 0.31261444%
Class: television, television system, Confidence: 0.29449463%
Class: pay-phone, pay-station, Confidence: 0.28057098%
Class: cassette, Confidence: 0.24833679%
Class: loudspeaker, speaker, speaker unit, loudspeaker system, speaker system, Confidence: 0.23517609%
Class: parking meter, Confidence: 0.20675659%
Class: menu, Confidence: 0.18892288%
Class: traffic light, traffic signal, stoplight, Confidence: 0.17757416%
Class: cinema, movie theater, movie theatre, movie house, picture palace, Confidence: 0.16860962%
Class: radio, wireless, Confidence: 0.16593933%
Class: comic book, Confidence: 0.14972687%
Class: desktop computer, Confidence: 0.10757446%
Class: joystick, Confidence: 0.09551048%
Class: oscilloscope, scope, cathode-ray oscilloscope, CRO, Confidence: 0.092458725%
Class: turnstile, Confidence: 0.08854866%
Class: modem, Confidence: 0.087070465%
Class: scale, weighing machine, Confidence: 0.086164474%
Class: cassette player, Confidence: 0.08072853%
Class: trailer truck, tractor trailer, trucking rig, rig, articulated lorry, semi, Confidence: 0.07648468%
Class: CD player, Confidence: 0.06937981%
Class: stopwatch, stop watch, Confidence: 0.0682354%
...
</pre>
</div>

<br>

---