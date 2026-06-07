import PyPDF2
import sys

def extract_text(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            text += reader.pages[page_num].extract_text()
    return text

if __name__ == "__main__":
    pdf_path = "d:\\Pekerjaan\\presentasifurab\\Rancangan Data Warehouse Aplikasi Furab untuk GoFood dan GoRide Analytics.pdf"
    print(extract_text(pdf_path))
