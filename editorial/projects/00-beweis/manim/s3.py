"""Szene s3 (manim-python): Quadratzahl-Graph, transparent ueber die Tapete gelegt.

Wird von scripts/ed.mjs mit --transparent und der Aufloesung des Videoformats gerendert.
Layout passt sich ueber config.frame_width an 16:9 und 9:16 an.
"""
import os

from manim import (
    Axes, Create, Dot, FadeIn, MathTex, Scene, Write, ValueTracker, always_redraw, config, UP, DOWN, linear,
)

CREAM = "#f3ecdc"
ORANGE = "#e38450"
DURATION = float(os.environ.get("ED_DURATION", "5"))  # Szenendauer aus storyboard.json


class S3(Scene):
    def construct(self):
        portrait = config.frame_width < config.frame_height
        w = config.frame_width * (0.82 if portrait else 0.55)
        h = config.frame_height * (0.38 if portrait else 0.6)
        axes = Axes(
            x_range=[0, 31, 10], y_range=[0, 961, 300], x_length=w, y_length=h,
            axis_config={"color": CREAM, "stroke_width": 3, "include_tip": False},
        )
        axes.shift(DOWN * (config.frame_height * (0.08 if portrait else 0.06)))
        n = ValueTracker(1)
        curve = always_redraw(lambda: axes.plot(lambda x: x**2, x_range=[0, n.get_value()], color=ORANGE, stroke_width=6 if not portrait else 10))
        dot = always_redraw(lambda: Dot(axes.c2p(n.get_value(), n.get_value() ** 2), color=ORANGE, radius=config.frame_width * 0.01))
        # Groesse relativ zur Bildbreite, damit 16:9 und 9:16 gleich gut lesbar sind.
        formula = MathTex(r"n \times n = n^2", color=CREAM)
        formula.scale_to_fit_width(config.frame_width * (0.6 if portrait else 0.28))
        formula.next_to(axes, UP, buff=config.frame_height * 0.05)
        result = MathTex(r"31 \times 31 = 961", color=CREAM)
        result.scale_to_fit_width(config.frame_width * (0.75 if portrait else 0.36)).move_to(formula)

        self.play(Create(axes), Write(formula), run_time=1.0)
        self.add(curve, dot)
        self.play(n.animate.set_value(31), run_time=2.2, rate_func=linear)
        self.play(FadeIn(result, shift=UP * 0.2), formula.animate.set_opacity(0), run_time=0.6)
        self.wait(max(0.1, DURATION - 3.8))
