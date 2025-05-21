import * as math from "mathjs"

function sampleDirichlet(alpha) {
    // Sample gamma-distributed random variables
    const gammas = alpha.map(a => math.gamma(a));

    // Normalize to obtain a Dirichlet sample
    const sumGammas = math.sum(gammas);
    const dirichletSample = gammas.map(gamma => gamma / sumGammas);

    return dirichletSample;
}

// Example usage
// const alpha = [5, 1, 1];
const alpha = new Array(10).fill(1)
alpha[0] = 10
alpha[1] = 10
const dirichletSample = sampleDirichlet(alpha);
console.log(dirichletSample)