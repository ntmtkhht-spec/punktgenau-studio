import numpy as np
from PIL import Image, ImageDraw

BLUE=(31,122,224); MAG=(214,31,105); GRAY=(200,200,200); BG=(255,255,255)
def primes_upto(n):
    s=np.ones(n+1,bool); s[:2]=False
    for i in range(2,int(n**.5)+1):
        if s[i]: s[i*i::i]=False
    return s

def polar(N, only_primes, W=874, r_dot=None, color=BLUE):
    s = primes_upto(N); img = Image.new('RGB',(W,W),BG); d = ImageDraw.Draw(img)
    scale = (W/2-6)/N
    ns = np.arange(1, N+1)
    if only_primes: ns = ns[s[1:]]
    rd = r_dot or max(1.2, 2.6 - np.log10(N)*0.3)
    for n in ns:
        x = W/2 + n*np.cos(n)*scale; y = W/2 - n*np.sin(n)*scale
        d.ellipse([x-rd,y-rd,x+rd,y+rd], fill=color)
    return img

panels = [
  ('alle Zahlen bis 1000', polar(1000, False, r_dot=3.2, color=GRAY)),
  ('Primzahlen bis 1000', polar(1000, True, r_dot=3.2)),
  ('Primzahlen bis 20000', polar(20000, True, r_dot=1.6)),
  ('Primzahlen bis 300000', polar(300000, True, r_dot=0.9)),
]
phone = Image.new('RGB',(4*330,330),(210,210,210))
for i,(n,im) in enumerate(panels): phone.paste(im.resize((316,316), Image.LANCZOS),(i*330+7,7))
phone.save('polar_phone.png')
full = Image.new('RGB',(2*874+20, 2*874+20),(210,210,210))
for i,(n,im) in enumerate(panels): full.paste(im,((i%2)*894,(i//2)*894))
full.save('polar_full.png')
# Zahlentheorie-Check fuer die spaeteren Aussagen
from math import gcd
phi = lambda m: sum(1 for k in range(1,m+1) if gcd(k,m)==1)
print('44/7 =', 44/7, ' 2pi =', 2*np.pi, ' 710/113 =', 710/113)
print('phi(6)=',phi(6),' phi(44)=',phi(44),' phi(710)=',phi(710))
s = primes_upto(300000)
ps = np.nonzero(s)[0]
for m in (6,44,710):
    used = len(set((ps[ps>m] % m).tolist()))
    print(f'Primzahlen > {m} belegen {used} von {m} Restklassen')
