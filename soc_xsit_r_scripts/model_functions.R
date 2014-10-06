
## Wrap model in function, so I can pass paramemters
compute.probs <- function(gamma, lambda, sigma, numPic, int) {
  sn <- gamma * sigma * (int+1)^-lambda
  on <- gamma * ((1-sigma) / (numPic-1))*(int+1)^-lambda;
  wn <- on/4;
  
  # probability correct on same trials (set ceiling value for p_0 at 1)
  if(sn <= 1) {
    p_s <- mean(rbinom(100000,1,sn + (1-sn)/numPic))
  } else {
    p_s <- mean(rbinom(100000,1,1))
  }
  
  # probability correct on switch trials     
  p_o <- mean(rbinom(100000,1,on + (1-on)/numPic))  
  
  return(c(p_s, p_o))
}


## separate model and simulations --> conceptually distinct 
## melt --> fix, but you want to design output 
## seq() --> gives you intervals for generating paramters 
## what does social cue do to these simulations? --> what would happen if it were actin on each aspect of the model
## changing intention --> predictions about which trials it would affect
## generatiing params - space things out in linear and logarithmic space
