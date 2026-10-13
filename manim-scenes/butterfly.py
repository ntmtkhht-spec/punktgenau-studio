"""Der Schmetterlingseffekt: Lorenz-Attraktor in Manim (Community Edition).

Inspiriert von 3b1b/videos -> _2024/manim_demo/lorenz.py
Rendern:  python -m manim -pqm butterfly.py ButterflyEffect
"""
import numpy as np
from manim import *
from scipy.integrate import solve_ivp

SCALE = 0.13
SIGMA, RHO, BETA = 10, 28, 8 / 3


def lorenz(_t, state):
    x, y, z = state
    return [SIGMA * (y - x), x * (RHO - z) - y, x * y - BETA * z]


def solve(state0, duration, dt=0.01):
    sol = solve_ivp(
        lorenz, (0, duration), state0,
        t_eval=np.arange(0, duration, dt), rtol=1e-10, atol=1e-12,
    )
    return sol.y.T


def to_scene(points):
    """Lorenz-Koordinaten -> Szenen-Koordinaten (Attraktor um den Ursprung zentrieren)."""
    return (points - np.array([0, 0, 25])) * SCALE


class ButterflyEffect(ThreeDScene):
    def construct(self):
        self.camera.background_color = "#07080f"
        self.set_camera_orientation(phi=72 * DEGREES, theta=-50 * DEGREES, zoom=0.9)

        # --- Titel -------------------------------------------------------
        title = Text("Der Schmetterlingseffekt", font_size=54, weight=BOLD)
        subtitle = Text("Chaos im Lorenz-Attraktor", font_size=28, color=GREY_B)
        subtitle.next_to(title, DOWN, buff=0.3)
        self.add_fixed_in_frame_mobjects(title, subtitle)
        self.play(Write(title), FadeIn(subtitle, shift=UP * 0.3), run_time=2)
        self.wait(0.8)
        self.play(FadeOut(title), FadeOut(subtitle))
        self.remove(title, subtitle)

        # --- Gleichungen -------------------------------------------------
        eqs = VGroup(
            Text("dx/dt = σ (y − x)", font_size=26),
            Text("dy/dt = x (ρ − z) − y", font_size=26),
            Text("dz/dt = x·y − β z", font_size=26),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        eqs[0].set_color(RED_B)
        eqs[1].set_color(GREEN_B)
        eqs[2].set_color(BLUE_B)
        params = Text("σ = 10   ρ = 28   β = 8/3", font_size=20, color=GREY_B)
        panel = VGroup(eqs, params).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        panel.to_corner(UL, buff=0.4)
        self.add_fixed_in_frame_mobjects(panel)
        self.play(Write(eqs, run_time=2.5), FadeIn(params))

        # --- Trajektorien ------------------------------------------------
        epsilon = 1e-5
        n = 14
        duration = 45
        starts = [[10, 10, 10 + k * epsilon] for k in range(n)]
        colors = color_gradient([BLUE_E, "#ff4d6d"], n)
        raw = [solve(s, duration) for s in starts]

        curves = VGroup()
        for pts, col in zip(raw, colors):
            curve = VMobject()
            curve.set_points_smoothly(to_scene(pts)[::3])
            curve.set_stroke(col, width=1.6, opacity=0.55)
            curves.add(curve)

        dots = VGroup(*[Dot3D(radius=0.07, color=c) for c in colors])
        dots.add_updater(
            lambda grp: [d.move_to(c.get_end()) for d, c in zip(grp, curves)]
        )

        # Abstand der ersten und letzten Trajektorie als logarithmischer Balken
        bar_max = 4.0
        sep_title = Text("Abstand (log)", font_size=22, color=YELLOW_B)
        track = Rectangle(width=bar_max, height=0.16, stroke_width=1, stroke_color=GREY_B)
        bar = Rectangle(width=0.01, height=0.16, stroke_width=0, fill_color=YELLOW_B, fill_opacity=1)
        lo = Text("10⁻⁵", font_size=16, color=GREY_B)
        hi = Text("10¹", font_size=16, color=GREY_B)
        track.to_corner(DL, buff=0.5).shift(UP * 0.45)
        sep_title.next_to(track, UP, buff=0.15, aligned_edge=LEFT)
        lo.next_to(track, DOWN, buff=0.1, aligned_edge=LEFT)
        hi.next_to(track, DOWN, buff=0.1, aligned_edge=RIGHT)

        def update_bar(b):
            d = np.linalg.norm(dots[0].get_center() - dots[-1].get_center()) / SCALE
            frac = np.clip((np.log10(max(d, 1e-9)) + 5) / 6, 0.002, 1)
            b.stretch_to_fit_width(bar_max * frac)
            b.align_to(track, LEFT).align_to(track, UP)

        bar.add_updater(update_bar)
        sep = VGroup(sep_title, track, bar, lo, hi)
        self.add_fixed_in_frame_mobjects(sep)
        hint = Text(
            f"14 Startpunkte, nur {epsilon:g} voneinander entfernt",
            font_size=22, color=GREY_B,
        ).to_corner(DR, buff=0.4)
        self.add_fixed_in_frame_mobjects(hint)
        self.play(FadeIn(hint))

        self.add(dots)
        self.begin_ambient_camera_rotation(rate=0.12)
        self.play(
            *[Create(c, rate_func=linear) for c in curves],
            run_time=26,
        )
        self.wait(1)

        # --- Abspann -----------------------------------------------------
        self.stop_ambient_camera_rotation()
        outro = Text(
            "Winzige Unterschiede  →  völlig verschiedene Zukunft",
            font_size=32, weight=BOLD,
        ).to_edge(UP, buff=0.5)
        self.add_fixed_in_frame_mobjects(outro)
        self.play(
            FadeIn(outro, shift=DOWN * 0.3),
            FadeOut(panel), FadeOut(hint), FadeOut(sep),
        )
        self.begin_ambient_camera_rotation(rate=0.25)
        self.wait(4)
