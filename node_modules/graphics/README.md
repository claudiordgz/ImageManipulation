##Graphics library for Face Recognition

This library contains functions to calculate the position of 
coordinates inside squares, and to partition squares into smaller 
squares. This works to find out if a Parallelogram is inside another and 
give an approximate about the position in which square is located
in relation to another Parallelogram.

Conditions:
    
    1. The Parallelogram contains the faces or other property found (lips, eyes).
    2. We can't assume a width or height for the images
    3. We can't assume an orientation
    4. We can't assume where will the faces be located.
    5. We can't assume a square contains all the faces
    6. We assume that the square containing the faces contains valid faces.
   
##Finding point in Parallelogram algorithm 

In a Rectangle with the following positions:

```
A  B
 ⌜⌝
 ⌞⌟
D  C
```

Point `M` of coordinates `(x,y)` is inside the rectangle if

    (0<AM⋅AB<AB⋅AB)∧(0<AM⋅AD<AD⋅AD)

(scalar product of vectors)
        
