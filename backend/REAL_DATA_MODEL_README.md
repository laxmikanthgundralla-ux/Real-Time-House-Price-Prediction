# Real-listings model integration

This backend is configured to download the published IAAC MaAI India flat-price model:
https://huggingface.co/iaac-maai/day2-example-house-price

The published model card says its training data comprises 49,968 cleaned asking-price listings
across 81 Indian cities, with a held-out test set of 12,492 listings. It reports test R²=0.854,
MAE=₹19.4 lakh and RMSE=₹34.8 lakh. These are author-reported figures and have not been
independently reproduced by this project.

Limitations and mappings in this integration:
- Training examples are flats/apartments only; this is not a house/villa/land model.
- It estimates asking prices, not verified transaction/sale prices.
- Data is dated through August 2023; current market prices may differ.
- The form's area is treated as gross area; carpet area is approximated as 80% of it.
- The form's `floors` value is interpreted as the flat's floor number. Total building floors
  are missing and left for model imputation.
- Property age is accepted to preserve API compatibility, but the published model has no age
  feature and therefore does not use it.
- Unsupported listing characteristics are marked unknown/missing and imputed by the model.
- `property_type` is mapped to `Flat` because the published training data contains flats only.
  The frontend should ideally offer Apartment only; other types should not be marketed as
  supported by this model.

Source data license: CDLA-Sharing-1.0. Published model license: MIT.
Model cards are Python pickle/joblib artifacts; only download/load from the trusted source above.

Render deployment:
- Keep the existing frontend unchanged for now.
- Deploy this backend folder to the same Render web service.
- Ensure Render installs `requirements.txt` and has outbound access to Hugging Face at startup.
- After deployment, check `/health` and `/api/model-metrics`, then test `/api/predict`.
- Do not claim predictions are real-time market values; they are model-based estimates from
  historical asking-price listings.
