from flask import Flask, request, jsonify
import pandas as pd

from recommend import build_svd_model, get_recommendations

app = Flask(__name__)

# Load ratings and products
ratings_matrix = pd.read_csv("data/ratings_matrix.csv", index_col=0)
products_df = pd.read_csv("data/products.csv", index_col=0)

# Train SVD
preds_df = build_svd_model(ratings_matrix, k=20)  # adjust k if needed

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id')
    n = request.args.get('n', default=5, type=int)

    if user_id not in ratings_matrix.index:
        return jsonify({"error": "Invalid user_id"}), 400

    rec_prod_ids = get_recommendations(user_id, ratings_matrix, preds_df, n)

    # Return product info
    rec_products = products_df.loc[rec_prod_ids].to_dict(orient='records')
    return jsonify({"recommendations": rec_products})

if __name__ == '__main__':
    app.run(debug=True)
