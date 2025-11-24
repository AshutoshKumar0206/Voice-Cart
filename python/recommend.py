import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds

def build_svd_model(ratings_matrix, k=20):
    """
    Train SVD and return predicted ratings DataFrame with same index & columns as ratings_matrix
    """
    U, s, Vt = svds(ratings_matrix.values, k=k)
    sigma = np.diag(s)
    all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt)
    
    preds_df = pd.DataFrame(all_user_predicted_ratings,
                            index=ratings_matrix.index,
                            columns=ratings_matrix.columns)
    return preds_df

def get_recommendations(user_id, ratings_matrix, preds_df, num_recommendations=5):
    """
    Returns list of product IDs recommended for the given user_id
    """
    if user_id not in ratings_matrix.index:
        raise ValueError("Invalid user_id")

    user_ratings = ratings_matrix.loc[user_id].values
    user_predictions = preds_df.loc[user_id].values

    # Only recommend items user hasn't rated yet
    unrated_indices = np.where(user_ratings == 0)[0]
    pred_scores = user_predictions[unrated_indices]

    top_indices = unrated_indices[np.argsort(pred_scores)[::-1]][:num_recommendations]
    top_prod_ids = ratings_matrix.columns[top_indices].tolist()
    return top_prod_ids
