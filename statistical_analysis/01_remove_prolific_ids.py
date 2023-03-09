# %%
import pandas as pd
import os

df_dir = "dataframes"

dataframes = os.listdir(df_dir)

for df_name in dataframes:
    df_path = f"{df_dir}/{df_name}"

    df = pd.read_csv(df_path)
    df = df.drop(columns=["Unnamed: 0"])

    try:
        df = df.drop(columns=["prolificid"])
    except:
        pass

    df.to_csv(df_path)

# %%
