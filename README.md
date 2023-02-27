# Hydrogen Atom Orbitals

[hydrogen.starfree.app](https://hydrogen.starfree.app) is a website that allows to explore and visualize the different orbitals of the hydrogen atom.

## Quantum numbers

Any orbital is determined by three integers called **quantum numbers**. These numbers are:
- Principal quantum number (**n**), 1 ≤ n ≤ ∞
- Azimuthal quantum number (**l**), 0 ≤ l ≤ n - 1
- Magnetic quantum number (**m**), -l ≤ m ≤ l

## Orbitals List

The orbital list is divided into sections each corresponding to a value of **n**.<br>
The sections are composed of thumbnails arranged by quantum numbers. The quantum numbers associated to a thumbnail are displayed at the bottom right **(n, l, m)**.<br>
Clicking on a thumbnail opens a 3D interactive view. The user can zoom and rotate the orbital. For the user to see inside, a part of the orbital is cut off. 
The slice size can be tweaked by dragging the top right control.

## How it works

The orbitals are simulated by generating thousands of random points following the same probability density as the electron in the same configuration. Therefore the density of points indicates the probability to find the electon in a given region, when its position is measured.
The orbitals are divided into "lobes" separated by a zero probability density region. Adjacent "lobes" are colored differently to visually separate them.

## Embedding

If you want to integrate an orbital representation in your own website or simply explore a specific orbital, you can use this link template:

```https://hydrogen.starfree.app/orbital?n=[n]&l=[l]&m=[m]&slice=[slice]&slicecontrol=[slicecontrol]&autorotate=[autorotate]&preview=[preview]```

Here is a recap of the different parameters:

| Parameter  | Description | Value | Default |
| ------------- | ------------- | ---------- | ---------- |
| n | principal quantum number | integer from `1` to `∞` | `1` |
| l | azimuthal quantum number l | integer from `0` to `n-1` | `0` |
| m | magnetic quantum number m | integer from `-l` to `l` | `0` |
| slice | orbital slice proportion | float from `0` to `1` | `0.8` |
| slicecontrol | display slice control | `true` or `false` | `true` |
| autorotate | make the orbital slowly rotate | `true` or `false` | `false` |
| preview | display a lighter version: faster to load, lower resolution | `true` or `false` | `false` |
| interaction | allow user interactions | `true` or `false` | `true` |


Here is an example of an HTML element you can add to your website:

```html
<iframe src="http://hydrogen.starfree.app/orbital?n=6&l=3&m=1&slice=0.8&slicecontrol=false&autorotate=false&preview=false&interaction=true" frameborder="0" width="400px" height="400px"></iframe>
```