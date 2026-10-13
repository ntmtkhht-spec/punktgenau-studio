import numpy as np
def spiral(size):
    n_max = size*size
    sieve = np.ones(n_max+1, bool); sieve[:2] = False
    for i in range(2, int(n_max**0.5)+1):
        if sieve[i]: sieve[i*i::i] = False
    g = np.zeros((size, size), int)
    half = size//2
    x = y = half; n = 1; g[y, x] = 1
    dirs = [(1,0),(0,-1),(-1,0),(0,1)]; d = 0; ln = 1
    while n < n_max:
        for _ in range(2):
            for _ in range(ln):
                if n >= n_max: break
                x += dirs[d][0]; y += dirs[d][1]; n += 1; g[y, x] = n
            d = (d+1) % 4
        ln += 1
    return g, sieve
for size in (101, 141, 201, 301):
    g, sieve = spiral(size)
    P = sieve[g] & (g > 0)
    # Diagonal-Anteil: Dichte der Primzahlen entlang jeder Diagonale
    dens = []
    for off in range(-size+40, size-40):
        for arr in (np.diag(P, off), np.diag(np.fliplr(P), off)):
            if len(arr) >= 40: dens.append(arr.mean())
    dens = np.array(dens)
    base = P.mean()
    print(f'size {size}: Gesamtdichte {base:.3f} | Diagonalen: {len(dens)} | max {dens.max():.2f} | >=2x Dichte: {(dens>=2*base).sum()} | >=3x: {(dens>=3*base).sum()}')
