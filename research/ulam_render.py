import numpy as np
from PIL import Image, ImageDraw
from ulam_diag import spiral

BLUE=(31,122,224); MAG=(214,31,105); LIGHT=(190,205,225); BG=(255,255,255); GRAYDOT=(220,220,220)
def hot_mask(P, mult, min_len=40):
    size = P.shape[0]; base = P.mean(); H = np.zeros_like(P)
    for off in range(-size+1, size):
        for flip in (False, True):
            A = np.fliplr(P) if flip else P
            d = np.diag(A, off)
            if len(d) >= min_len and d.mean() >= mult*base:
                idx = np.arange(len(d)); r = idx + max(-off, 0); c = idx + max(off, 0)
                if flip: c = size-1-c
                H[r, c] = True
    return H

def render(size, W=874, mode='dots', mult=2.7):
    g, sieve = spiral(size); P = sieve[g] & (g>0)
    cell = W/size; img = Image.new('RGB',(W,W),BG); d = ImageDraw.Draw(img)
    H = hot_mask(P, mult)
    ys, xs = np.nonzero(P)
    if mode == 'dots':
        for y,x in zip(ys,xs):
            cx,cy=(x+.5)*cell,(y+.5)*cell; r=cell*.34
            d.ellipse([cx-r,cy-r,cx+r,cy+r], fill=MAG if H[y,x] else BLUE)
    elif mode == 'squares':
        for y,x in zip(ys,xs):
            d.rectangle([x*cell,y*cell,(x+1)*cell-.5,(y+1)*cell-.5], fill=BLUE)
    elif mode == 'strong':
        # nur die starken Diagonalen faerben, restliche Primzahlen hellgrau-blau, volle Zellgroesse
        for y,x in zip(ys,xs):
            d.rectangle([x*cell,y*cell,(x+1)*cell-.5,(y+1)*cell-.5], fill=MAG if H[y,x] else LIGHT)
    return img

if __name__ == '__main__':
    variants = [
        ('A aktuell (Punkte r=.34, 141, >=2.7x)', render(141, mode='dots', mult=2.7)),
        ('B Quadrate einfarbig (141)', render(141, mode='squares')),
        ('C Quadrate einfarbig (201)', render(201, mode='squares')),
        ('D nur starke Linien (141, >=3.5x)', render(141, mode='strong', mult=3.5)),
    ]
    W = 874
    sheet = Image.new('RGB', (W*2+30, W*2+30), (200,200,200))
    for i,(name,im) in enumerate(variants):
        sheet.paste(im, ((i%2)*(W+30), (i//2)*(W+30)))
    sheet.save('ulam_variants.png')
    # Handy-Massstab: 1080 breit -> ca. 390 Punkte; Spirale 874 px -> ca. 316 px
    phone = Image.new('RGB', (4*330, 330), (200,200,200))
    for i,(name,im) in enumerate(variants):
        phone.paste(im.resize((316,316), Image.LANCZOS), (i*330+7, 7))
    phone.save('ulam_variants_phone.png')
    print('ok', [n for n,_ in variants])
