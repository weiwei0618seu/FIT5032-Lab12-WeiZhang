# Lab 5 Report

Place all screenshot PNG files and `monash-university-vector-logo.png` in this
directory beside `lab5_report.tex`.

Check the screenshot names:

```powershell
node report/check-screenshots.mjs
```

Compile from this directory after all images have been added:

```powershell
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build lab5_report.tex
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build lab5_report.tex
```

The final PDF will be `report/build/lab5_report.pdf`.
