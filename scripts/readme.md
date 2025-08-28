# How to add new models to Breakable Machine

This readme-file goes trough the process of adding new model to the game
</br>

These scripts will create thumbnail pictures and json-files. Also generate_type2.py will alter resolution of original pictures to have max 512px width and height.
</br>
If you want to keep original pictures, make copy of them to different location before executing script.
</br>

There is two different scripts in this scripts folder:

-   generate_type2.py
-   generate_from_tm_export.py

</br>

## Generating new model (with generate_type2.py)

<p> 
Generating model in this way will result on max 512px sized preview pictures. Generating with generate_from_tm_export.py will have lower resolution of 224px * 224px.
</p>

<em>In this example we will be creating new model called 'jobs'.
</br>
The model will include seven labels</em>

1. Make root folder for your new model (small letters). Name of the folder should be same as the model name will be. (picture 1)

![Picture 1](./images/image.png)
<br/><em>picture 1</em>

2. Inside the root folder, create folders for each label (small letters again) (picture 2) </br>
   Please name them in English (default language)</p>

![Picture 2](./images/image-1.png)
<br/><em>picture 2</em>

3. Find pictures for each label and place pictures in their folders (picture 3)

![Picture 3](./images/image-2.png)
<br/><em>picture 3</em>

4. Make a model with https://tm.gen-ai.fi/image/general
 <p>You can drag and drop images from their folders. (picture 4)
 </br>
 Here the word can be capitalized (if you like them to be in game capitalized).
 </p>

![Picture 4](./images/image-3.png)
</br><em>picture 4</em>

5. Save the model (no behaviors or samples) using same name that you used as a root folder.

![Picture 5](./images/image-4.png)
</br><em>picture 5</em>

6. Prepare for script execution

 <p>
 Do not alter the saved zip file any way. It should contain three files:
 
 ![alt text](./images/image-6.png)

 </br>
 Make a <b>copy</b> of that metadata.json and place that inside the root folder.
 (picture 6)

 </br>
 Also make a <b>copy</b> of generate_type2.py script (located at the same folder as this readme) and place that also to root folder. (picture 6)
 </p>

![alt text](./images/image-5.png)
</br><em>picture 6</em>

7. Run the script (by double click) (assuming you have python installed)

<em>Script may take few minutes to run. It will resize every picture that is over 512px height or width</em>

8. Do translations

There is also translations.json -file created. It fills en-GB automatically with the label-names.
Do translations to NULL (you can use notepad or what you prefer for that)

9. Delete metadata.json and generate_type2.py from root folder
