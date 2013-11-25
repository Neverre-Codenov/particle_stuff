/*

My Javascript Vector

This library defines a Javascript ~vector~ as a 
set of 2D x, y coordinates and provides methods
and utilities for vector operations. I built this
library to make life easier in working with SVG
sprites.

Authored by: Nick Nagel,
and dated:   2010.08.09

*/

/*
Constructor

Constructs a vector instance given 
x, y coordinates...

Authored by: Nick Nagel,
and dated:   2010.08.09

*/
function Vector( x, y )
{
  this.x = x;
  this.y = y;
}


Vector.prototype.toString = function()
{
  return  this.x + " " + this.y;
}

/*
  Returns a scalar representing the magnitude of 
  the vector.
*/
Vector.prototype.getMagnitude = function()
{
  return( Math.sqrt( this.x*this.x + this.y*this.y ) );
}


/*
  Returns a scalar representing the orientation of
  the vector in degrees in 1st quadrant from the X 
  axis.
*/
Vector.prototype.getOrientation = function()
{
  // GIVEN X AND Y COORDINATES...
  // COMPUTE TANGENT
  // GET ARCTAN
  // CONVERT TO DEGREES
  var tan = this.y / this.x;
  var radians = Math.atan( tan );
  var degrees = radians * 180 / Math.PI;

  
  // Handle cases where x = 0 (division by 0 undefined)
  if( (this.x == 0) && ( this.y >= 0 ) )
  {
      return 90;
  }
  else if( (this.x == 0) && ( this.y < 0 ) )
  {
      return 270;
  }
  // Handle cases where y = 0 
  else if( ( this.x > 0 ) && (this.y==0) )
  {
      return 0;
  }
  else if( ( this.x < 0 ) && (this.y==0) )
  {
      return 180;
  }
  
  
  // ALL ELSE
  else if( (this.x > 0) && (this.y > 0) ) // Quadrant I
  {
    return( degrees );
  }
  else if( (this.x < 0) && (this.y > 0) )    // Quadrant II
  {
    return( degrees + 180  ); // theta is given in - degrees 
  }
  else if( (this.x < 0) && (this.y < 0) )    // Quadrant III
  {
    return( degrees + 180 );
  }
  else if( (this.x > 0) && (this.y < 0) )    // Quadrant IV
  {
    return( degrees + 360 );  // theta is given in - degrees
  }

}


// Vector Related Utilities

/*
  Adds two vector objects and returns a new
  vector representing the sum.
*/
function addVectors( v1, v2 )
{
  return new Vector( (v1.x + v2.x), (v1.y + v2.y) );
}


/*
  Subtracts two vector objects and returns a new
  vector representing the difference.
*/
function subtractVectors( v1, v2 )
{
  return new Vector( (v1.x - v2.x), (v1.y - v2.y) );
}


/*
  Constructs and returns a new vector given
  a magnitude and orientation in degrees from
  x-axis...
*/
function getVectorFrom( magnitude, orientation )
{

  // Implementation notes:
  // 
  // The vector components are:
  //
  // (1) Vx is determinable from the cosine of 
  // the angle as follows:
  //  
  //  Vx = |v| cos theta[x]
  // 
  // (2) Vy is determinable from the sine of 
  // the angle:
  // 
  //  Vy = |v| cos theta[y] = |v| sin theta[x]
  
  var Vx = magnitude * Math.cos( orientation * (Math.PI / 180) );
  var Vy = magnitude * Math.sin( orientation * (Math.PI / 180) );
  return new Vector( Vx, Vy );

}


/**
 * Returns a new vector which is the norm (i.e., vector of same
 * direction but unit length) of the input vector according to:
 * 
 *  Vn = V / || V ||
 *
 */
function getNormalVector( vector )
{
    if( vector.getMagnitude() != 0 )
    {
        var x = vector.x / vector.getMagnitude();
        var y = vector.y / vector.getMagnitude();
    }
    return new Vector( x, y );
}

