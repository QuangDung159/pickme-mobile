#! /bin/bash

# for f in assets/images/*.jpeg; do
# for f in assets/images/guideImages/*.png; do
# for f in assets/images/*.jpeg; do
  echo "Converting $f"
  ff=${f%????}  
  echo "no ext ${ff}"
  ./cwebp -q 75 -m 6 "$(pwd)/${f}" -o "$(pwd)/${ff}.webp"
  rm -f "$(pwd)/${f}"
done