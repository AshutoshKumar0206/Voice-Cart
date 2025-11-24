import pandas as pd

final_ratings_matrix = pd.read_csv(
    "D:/C_programming/webdev/Hackathons/Voice-Cart/python/data/ratings_matrix.csv",
    index_col=0
)

print(final_ratings_matrix.index[:10])
