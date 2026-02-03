#!/bin/bash

# Generate self-signed SSL certificates for development

set -e

# Create ssl directory if it doesn't exist
mkdir -p ssl

echo "Generating self-signed SSL certificate for localhost..."

# Generate private key
openssl genrsa -out ssl/server.key 2048

# Generate certificate signing request
openssl req -new -key ssl/server.key -out ssl/server.csr \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate self-signed certificate (valid for 365 days)
openssl x509 -req -days 365 -in ssl/server.csr -signkey ssl/server.key -out ssl/server.crt \
  -extfile <(printf "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:0.0.0.0")

# Remove CSR file
rm ssl/server.csr

echo ""
echo "✓ SSL certificates generated successfully!"
echo ""
echo "Location:"
echo "  Private Key: ssl/server.key"
echo "  Certificate: ssl/server.crt"
echo ""
echo "Note: These are self-signed certificates for development only."
echo "Your browser may show a security warning - this is normal."
echo "Accept the warning to continue."
echo ""
echo "For production, use:"
echo "  - Let's Encrypt for free certificates"
echo "  - Commercial CA for signed certificates"
