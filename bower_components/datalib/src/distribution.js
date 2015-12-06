var distribution = {};
// Each distribution needs a pdf, cdf and icdf

/*
Usage: 
    var foo = new distribution.Normal(0,1);
    var bar = foo.sample();
*/
// Uniform Distribution
distribution.Uniform = function(a,b){
  this.pdf = function(x){
    var pd = (x>=a && x<=b) ? 1/(b-a) : 0;
    return pd; 
  };
  this.cdf = function(x){
    if(x<a){
      return 0;
    }
    else if(x>b){
      return 1;
    }
    else{
      return (x-a) / (b-a);
    }
  };
  this.icdf = function(p){
    var id= (p>=0 && p<=1) ? a+(p*(b-a)) : NaN;
    return id; 
  };
};

// Normal Distribution
distribution.Normal = function(mu,sigma){
  this.mu = !mu ? 0 : mu;
  this.sigma = !sigma ? 1 : sigma;
  this.pdf = function(x){
    var exponential = Math.exp(-1 * Math.pow(x-this.mu,2) / (2 * Math.pow(this.sigma,2) ) );
    return (1/ (this.sigma * Math.sqrt(2*Math.PI)) ) * exponential; 
  };
  this.cdf = function(x){
  // Approximation from West (2009) Better Approximations to Cumulative Normal Functions
    var cd,
        z = (x - this.mu) / this.sigma,
        Z = Math.abs(z);
    if(Z>37){
      cd = 0;
    }
    else{
      var sum,
          exponential = Math.exp( -1*(Z*Z) / 2); 
      if(Z<7.07106781186547){
        sum = 3.52624965998911e-02*Z + 0.700383064443688;
        sum = sum*Z + 6.37396220353165;
        sum = sum*Z + 33.912866078383;
        sum = sum*Z + 112.079291497871;
        sum = sum*Z + 221.213596169931;
        sum = sum*Z + 220.206867912376;
        cd = exponential * sum;
        sum = 8.83883476483184e-02*Z + 1.75566716318264;
        sum = sum*Z + 16.064177579207;
        sum = sum*Z + 86.7807322029461;
        sum = sum*Z + 296.564248779674;
        sum = sum*Z + 637.333633378831;
        sum = sum*Z + 793.826512519948;
        sum = sum*Z + 440.413735824752;
        cd = cd / sum;
      }
      else{
        sum = Z + 0.65;
        sum = Z + 4 / sum;
        sum = Z + 3 / sum;
        sum = Z + 2 / sum;
        sum = Z + 1 / sum;
        cd = exponential / sum / 2.506628274631;
      }
    }
    if(z>0)
      return 1-cd;
    else
      return cd;
  };
  this.icdf = function(p){
  // Approximation of Probit function using inverse error function.
    if(p<=0 || p>=1){
      return NaN;
    }
    else{
      var ierf = function(x){
        var a = (8*(Math.PI - 3))/(3 * Math.PI * (4-Math.PI)),
            parta = ( 2 / (Math.PI*a) ) + (Math.log(1-Math.pow(x,2))/2),
            partb = Math.log(1 - (x*x))/a,
            signx = (x>0) ? 1 : -1;
        return signx*Math.sqrt( Math.sqrt( (parta*parta) - partb) - parta);
      };
      return this.mu + this.sigma*Math.sqrt(2)*ierf(2*p - 1);
    }
  };
};


module.exports = distribution;
