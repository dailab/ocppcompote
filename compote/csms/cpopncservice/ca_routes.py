
import datetime
import os
from pathlib import Path
from typing import Any

from cryptography import x509
from cryptography.hazmat._oid import NameOID
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import ec
from fastapi import APIRouter, Depends
from compote.csms.context.csms_contextmanager import get_shared_context_manager

router = APIRouter()

@router.get("/generate_csms_certs", tags=["CPO PNC Client API"])
async def generate_csms_certs(
    context_manager=Depends(get_shared_context_manager),
) -> Any:
    script_dir = Path("./compote/csms/certificates/")
    script_dir.mkdir(parents=True, exist_ok=True)

    csr_file = os.path.join(script_dir, "csms.csr")
    key_file = os.path.join(script_dir, "csms.key")
    pem_file = os.path.join(script_dir, "csms.pem")
    crt_file = os.path.join(script_dir, "csms.crt")

    private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())

    with open(key_file, "wb") as key_f:
        key_f.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ))

    csr = x509.CertificateSigningRequestBuilder().subject_name(x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, u"CSMS"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, u"Compote"),
    ])).add_extension(
        x509.SubjectAlternativeName([
            x509.DNSName(u"localhost"),
            x509.DNSName(u"gateway"),
            x509.DNSName(u"lb"),
        ]),
        critical=False,
    ).sign(private_key, hashes.SHA256(), default_backend())

    with open(csr_file, "wb") as csr_f:
        csr_f.write(csr.public_bytes(serialization.Encoding.PEM))

    # Generate self-signed certificate
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, u"CSMS"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, u"Compote"),
    ])
    cert = x509.CertificateBuilder().subject_name(
        subject
    ).issuer_name(
        issuer
    ).public_key(
        private_key.public_key()
    ).serial_number(
        x509.random_serial_number()
    ).not_valid_before(
        datetime.datetime.utcnow()
    ).not_valid_after(
        datetime.datetime.utcnow() + datetime.timedelta(days=365)
    ).add_extension(
        x509.SubjectAlternativeName([
            x509.DNSName(u"localhost"),
            x509.DNSName(u"gateway"),
            x509.DNSName(u"lb"),
        ]),
        critical=False,
    ).add_extension(
        x509.BasicConstraints(ca=False, path_length=None),
        critical=True,
    ).add_extension(
        x509.KeyUsage(
            digital_signature=True,
            content_commitment=False,
            key_encipherment=True,
            data_encipherment=False,
            key_agreement=False,
            key_cert_sign=False,
            crl_sign=False,
            encipher_only=False,
            decipher_only=False
        ),
        critical=True,
    ).sign(private_key, hashes.SHA256(), default_backend())

    with open(pem_file, "wb") as cert_f:
        cert_f.write(cert.public_bytes(serialization.Encoding.PEM))

    with open(crt_file, "wb") as der_f:
        der_f.write(cert.public_bytes(serialization.Encoding.PEM))

    return {"message": "Self-signed CSMS certificates generated successfully", "location" : script_dir}