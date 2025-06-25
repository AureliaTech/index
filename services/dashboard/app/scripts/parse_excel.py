#!/usr/bin/env python3
import sys, json, pandas as pd, traceback

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)

    file_path = sys.argv[1]

    try:
        xls = pd.read_excel(file_path, sheet_name=None, engine="openpyxl")
        summary = {name: len(df) for name, df in xls.items()}
        print(json.dumps({"status": "ok", "sheets": summary}))
    except Exception as e:
        traceback.print_exc()
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()