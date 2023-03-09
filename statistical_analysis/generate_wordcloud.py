from wordcloud import WordCloud
import nltk
import pandas as pd
import matplotlib.pyplot as plt

nltk.download("stopwords")
from nltk.corpus import stopwords

german_stop_words = stopwords.words("german")


# %% Word Cloud of Personal Location

accepted_userids = pd.read_csv("results/accepted_userids.csv")

personal_location = pd.read_csv("dataframes/freetext-s1.log.csv").loc[
    :, ["userid", "datetime", "freetext"]
]

personal_location = (
    personal_location.loc[personal_location.userid.isin(accepted_userids.userid)]
    .sort_values(by="datetime")
    .drop_duplicates(keep="last", subset=["userid"])
)

personal_location = personal_location.freetext.str.cat(sep=" ")

import string

personal_location = personal_location.translate(
    str.maketrans("", "", string.punctuation)
)

personal_location = personal_location.replace("  ", " ")

personal_location = personal_location.split(" ")

personal_location = [item.lower() for item in personal_location]

personal_location = [
    item for item in personal_location if item not in german_stop_words
]

personal_location = " ".join(personal_location)

wordcloud = WordCloud(width=1000, height=500, background_color="white").generate(
    personal_location
)

plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
wordcloud.to_file("results/plots/wordcloud_personal_place.png")
plt.show()

# %%
