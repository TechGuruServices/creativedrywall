"""
Generate an optimized multi-size favicon.ico from the source image.
Google Search requires a favicon that is a multiple of 48x48 pixels.
"""
from PIL import Image
import os

# Source image path (use the 512x512 icon as the highest quality source)
SOURCE_IMAGE = os.path.join(os.path.dirname(__file__), '..', 'public', 'icon-512x512.png')
OUTPUT_ICO = os.path.join(os.path.dirname(__file__), '..', 'public', 'favicon.ico')

# Standard favicon sizes (Google prefers 48x48)
SIZES = [(16, 16), (32, 32), (48, 48)]

def generate_favicon():
    """Generate an optimized multi-size favicon.ico"""
    print(f"Loading source image: {SOURCE_IMAGE}")
    img = Image.open(SOURCE_IMAGE)
    
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Create resized versions for each size
    icons = []
    for size in SIZES:
        resized = img.resize(size, Image.Resampling.LANCZOS)
        icons.append(resized)
        print(f"  Generated {size[0]}x{size[1]} icon")
    
    # Save as ICO with all sizes embedded
    icons[0].save(
        OUTPUT_ICO,
        format='ICO',
        sizes=SIZES,
        append_images=icons[1:]
    )
    
    # Verify file size
    file_size = os.path.getsize(OUTPUT_ICO)
    print(f"\nSaved: {OUTPUT_ICO}")
    print(f"File size: {file_size:,} bytes ({file_size / 1024:.1f} KB)")
    
    if file_size > 50000:
        print("WARNING: File is larger than recommended (50KB)")
    else:
        print("✓ File size is optimal for web use")

if __name__ == '__main__':
    generate_favicon()
