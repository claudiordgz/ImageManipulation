##FaceCentering library for Face Recognition

This library contains functions that operate over multiple
objects found by Tracking JS. 


Positioning the faces

To position the faces we need to know the maximum size this will take.
We assume that the box contains valid faces. We then break the source image into
quadrants to determine where is are the faces. Then we calculate in which quadrants
are our faces. 

1. We receive our image, we need access to the binary data of the image, which
may require downloading it or having it cached in a CORS enabled server.

![Le wild image appears](https://raw.githubusercontent.com/claudiordgz/faces/master/src/lib/faceCentering/docs/assets/001.png)

2. We use face recognition software, in its most basic configuration it will retrieve 
some faces. If it doesn't retrieve all, we would have to retrieve further information<sup>1</sup>.

![Le wild faces are detected](https://raw.githubusercontent.com/claudiordgz/faces/master/src/lib/faceCentering/docs/assets/002.png)

3. We define a face box, that contains all the found faces.

![Le wild faces are detected](https://raw.githubusercontent.com/claudiordgz/faces/master/src/lib/faceCentering/docs/assets/003.png)

4. We partition the image into quadrants and detect the vertices that touch each quadrant.

![Le wild quadrants are sliced](https://raw.githubusercontent.com/claudiordgz/faces/master/src/lib/faceCentering/docs/assets/004.png)

5. We calculate the area of the face box contained in each quadrant, 
then we calculate the percentage this area represents against the whole face box. 

![Le wild areas are calculated](https://raw.githubusercontent.com/claudiordgz/faces/master/src/lib/faceCentering/docs/assets/005.png)

6. Now we need to calculate an anchor point. In the case of this example the anchor point
is center, because all parts of the face box have very similar percentages, thus there is no
dominant quadrant. Then we try to position our background image in a circular div.

![Le wild div is positioned](https://raw.githubusercontent.com/claudiordgz/faces/master/src/lib/faceCentering/docs/assets/006.png)

7. As we can see to showcase all the faces we would have blank spaces, which is solvable<sup>2</sup>. 
As of now we need to prevent all white space so we default to cover all the div while centering the image (since 
all of the quadrants a more or less equal percentage of the faces). 

![Le wild image is centered](https://raw.githubusercontent.com/claudiordgz/faces/master/src/lib/faceCentering/docs/assets/007.png)


##<sup>1</sup> Getting more data from the images

Basic Face Recognition is done using a technology called Haar Cascades. We don't really have to get
into that but we could try retrieving more information and adjusting such haar cascades to detect more information.


Other information we may retrieve are for example eyes, or mouths, which by comparing them to the face box
We will be able to know if they are part of an already detected face or not. 

##<sup>2</sup> Solving the blank spaces

Not all faces will fit into the circle. A simple solution is to check the color in the 10% of the margins, from 
there we could choose a color or even clip the margin if it has some border and use a color. 

