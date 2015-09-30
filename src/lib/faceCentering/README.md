##FaceCentering library for Face Recognition

This library contains functions that operate over multiple
objects found by Tracking JS. 


Positioning the faces

To position the faces we need to know the maximum size this will take.
We assume that the box contains valid faces. We then break the source image into
quadrants to determine where is are the faces. Then we calculate in which quadrants
are our faces. 

    find the 
