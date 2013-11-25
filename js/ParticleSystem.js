var NUM_PARTICLES  = 100;
var LIFESPAN_CONST = 100;
var DOWNWARD_GRAVITATIONAL_ACCELERATION = new Vector( 0, 0.01 );
var COEFFICIENT_OF_FRICTION = 0.05
var LIFT = new Vector(0, -0.02  );
var PUSH = getVectorFrom( 0.05, 0 );
var NONE = new Vector( 0, 0 );


/**
 *
 * The particle is a sprite which has an age and lifespan.
 * As a sprite it knows how to render itself...
 *
 */
function Particle()
{
    this.location;  // A vector object
    this.velocity;  // A vector object
    // Elapsed time since particle creation
    this.age = 0;
    // Time allotted for particle existance
    this.lifeSpan = 0;
    this.mass     = 1;
    
    this.settings = function(
      location,
      velocity,
      lifeSpan
    )
    {
      this.location = location;
      this.velocity = velocity;
      this.age      = 0;
      this.lifeSpan = lifeSpan;
    }
    
    /**
     *  Renders sprite to 
     *
     *  Param 1 the HTML5 Canvas graphics context
     */

    this.render = function( ctx )
    {
        ctx.save();
        ctx.fillStyle = "#0000ff";
        ctx.translate( this.location.x, this.location.y );
	    ctx.beginPath();
	      ctx.arc( 0, 0, 1, 0, Math.PI*2, true );
	    ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

}


function ParticleEmitter()
{
    this.location;
    this.rectangle;
    this.n = 0;
    this.particles = []; // particle container
 
    /**  Initialize a particle emmitter with...
      *  param 1 location (a vector)
      *  param 2 area  (a rectangle)
      *  param 3 number of particles
      */
    this.init = function( location, area, numParticles )
    {
        this.location  = location;
	this.rectangle = area;
        this.n         = numParticles;
    }


    this.emit = function()
    {
    
        // PIXIE DUST: VARIABLE LIFESPAN 150 +- 50
        var lifespan = LIFESPAN_CONST;
        lifespan     = lifespan + (  Math.floor( Math.random() * 101 )  );
        
        // VARIABLE AREA
        this.rectangle.top  = this.location.y - ( this.rectangle.height / 2 );
        this.rectangle.left = this.location.x - ( this.rectangle.width  / 2 ); 
        var loc_x = this.rectangle.left + Math.random() * this.rectangle.width;
        var loc_y = this.rectangle.top + Math.random() * this.rectangle.height;

        var particle = new Particle();
        particle.settings(
            new Vector( loc_x, loc_y ),
            getVectorFrom( random_speed(), random_orientation() ),
            lifespan
        );
        this.particles.push( particle );
    }

}



/**
 * (Re)sets a particle given it's index
 */
ParticleEmitter.prototype.generateParticle = 
  function( index )
  {
      var loc_x = this.location.x + ( Math.floor( Math.random() * this.rectangle.width + 1 ) - ( this.rectangle.width / 2 ) );
      var loc_y = this.location.y + ( Math.floor( Math.random() * this.rectangle.height + 1 ) - ( this.rectangle.height / 2 ) );
      
      //var loc_x = random_screen_x();
      //var loc_y = random_screen_y();

      this.particles[index].settings(
         new Vector( loc_x, loc_y ),
         getVectorFrom( random_speed(), random_orientation() ),
	 LIFESPAN_CONST
      );
  }


/**
 * The particle system is a controller which knows about emitter
 * attractor(s) etc. Particle system periodically updates and
 * applies physical forces...
 */
function ParticleSystem()
{
    this.particleEmitter;
    this.attractor;
    this.init = function()
    {
        this.particleEmitter = new ParticleEmitter();
        this.particleEmitter.init (
            new Vector( 100, 100 ),
            new Rectangle( 100, 100, 10, 10 ),
            NUM_PARTICLES
        );
        
    }

    // CONTROLLING THE ANIMATION LOOP WITH PHYSICS COUPLED IN...
    this.update = function()
    {
    
	// EMIT PARTICLES
	/*
	if( dragging )
	{
	    this.particleEmitter.emit();
        }
        */
    
        for(var i=0; i<this.particleEmitter.particles.length; i++)
        {
           if( this.particleEmitter.particles[i].age < this.particleEmitter.particles[i].lifeSpan )
	   {
		// APPLY FORCES
		this.applyForce( 
		  this.particleEmitter.particles[ i ], 
		  NONE 
		);
		
		//this.doAttraction( this.attractor, this.particleEmitter.particles[ i ], 1 );
		
		this.applyGravity( 
		  this.particleEmitter.particles[ i ]
		);
		
		/*
                this.applyForce( 
		  this.particles[ i ], 
		  PUSH 
		);
                   
                this.applyFriction( 
                  this.particleEmitter.particles[ i ], 
		  COEFFICIENT_OF_FRICTION
                );
                */ 

		// UPDATE POSITION
		this.particleEmitter.particles[ i ].location = addVectors(
		        this.particleEmitter.particles[ i ].location,
		        this.particleEmitter.particles[ i ].velocity
			);
			
		// AGE THE PARTICLE
		this.particleEmitter.particles[i].age += 10;
	    }
	    else
	    {
	        this.particleEmitter.particles.splice( i, 1 );
	    }
	}
    }


    this.renderParticles = function( ctx )
    {
        for( var i = 0; i < this.particleEmitter.particles.length; i++ )
        {
            this.particleEmitter.particles[i].render( ctx );
        }
    }
}


// physics
/**
 * Applies a given...
 *
 *  param 1: force (a vector quantity)
 *
 *  to 
 *
 *  param 2: a specified particle
 *
 */
ParticleSystem.prototype.applyForce =
  function( particle, force )
  {
      // FROM NEWTON: Acceleration = Force / mass .
      // THEREFORE... (divide Force by mass (a scalar) to get particle ACCELERATION...)
      // Hold orientation
      var ao = force.getOrientation();
      var am = force.getMagnitude() / particle.mass;
      var acceleration = getVectorFrom( am, ao );
      particle.velocity =
        addVectors(
          particle.velocity,
          acceleration
        )
  }
  

ParticleSystem.prototype.applyGravity =
  function( particle )
  {
      particle.velocity =
        addVectors(
          particle.velocity,
          DOWNWARD_GRAVITATIONAL_ACCELERATION
        )
  }
  
  
ParticleSystem.prototype.applyFriction =
  function ( particle, coefficient )
  {
      var magnitude = coefficient * particle.velocity.getMagnitude() * -1;
      var friction  = getVectorFrom( magnitude, particle.velocity.getOrientation() );  
      this.applyForce( particle, friction );
  }
  
  
/*
 * This function "does attraction" by caculating the distance
 * vector between particles, normalizing for direction then 
 * applying the strength to get the force according to:
 * 
 * F[attract] = (s * (m1 * m2)) / (d^2) (where d = distance)
 */

ParticleSystem.prototype.doAttraction = 
  function( attractor, attractee, strength )
  {
    // Subtract attracTEE from attracTOR to get distance
    var diffVector = subtractVectors( attractor.location, attractee.location );
    var distance = diffVector.getMagnitude();
    var directionVector = getNormalVector( diffVector );
    var forceAttraction = ( strength * attractor.mass * attractee.mass ) / (distance * distance) ;
    var attraction = getVectorFrom( forceAttraction, directionVector.getOrientation() );
    this.applyForce( attractee, attraction);
  }


// convienience generators
var random_orientation = function()
{
     var num = Math.floor( Math.random() * ( 360 + 1 )  )  ;
     return num;
}

var random_speed = function()
{
     var num =  Math.random() * 0.5;// + 1;
     return num;
}

var random_screen_x = function()
{
     var num = Math.floor( Math.random() * 401 ) ;
     return num;
}

var random_screen_y = function()
{
     var num = Math.floor( Math.random() * 301 ) ;
     return num;
}

