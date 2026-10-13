from manim import *

class LatexTest(Scene):
    def construct(self):
        f = MathTex(r"d = \sqrt{(x_1-x_2)^2 + (y_1-y_2)^2}")
        self.play(Write(f))
        self.wait(0.5)
