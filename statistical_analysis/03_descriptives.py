# %%

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import ast


result_df_path = "results/result_df.csv"

accepted_userids = pd.read_csv("results/accepted_userids.csv")

result_df = pd.read_csv(result_df_path)
result_df = result_df.loc[result_df.userid.isin(accepted_userids.userid)]

c1 = result_df.loc[result_df.condition == "c1", :]
c2 = result_df.loc[result_df.condition == "c2", :]
c3 = result_df.loc[result_df.condition == "c3", :]

# %% Descriptive Tables


def print_descriptives_table(
    condition, columns=["nfc", "iuipc", "numeracy", "ueq_hedonic", "ueq_pragmatic"]
):
    mapping = {
        "ueq_hedonic": "UEQ hedonic dimension",
        "ueq_pragmatic": "UEQ pragmatic dimension",
        "ueq_total": "UEQ total score",
        "nfc": "NFC Score",
        "iuipc": "PrivacyConcern",
        "c1": "Simple",
        "c2": "Visual",
        "c3": "Bayesian",
        "numeracy": "Numeracy",
    }

    desc_df = result_df.loc[result_df.condition == condition, columns]

    print(f"\\begin{{table}}[]")
    print("    \\centering")

    print(desc_df.describe().to_latex())

    print(
        f"\\caption{{Descriptive for measures within condition{mapping[condition]}.}}"
    )
    print(f"\\label{{tab:descriptives_{condition}}}")

    print(f"\\end{{table}}")


print_descriptives_table("c1")
print_descriptives_table("c2")
print_descriptives_table("c3")

print_descriptives_table(
    "c1",
    columns=[
        "epsilon_1",
        "epsilon_2",
        "epsilon_3",
        "epsilon_4",
        "epsilon_5",
    ],
)
print_descriptives_table(
    "c2",
    columns=[
        "epsilon_1",
        "epsilon_2",
        "epsilon_3",
        "epsilon_4",
        "epsilon_5",
    ],
)
print_descriptives_table(
    "c3",
    columns=[
        "epsilon_1",
        "epsilon_2",
        "epsilon_3",
        "epsilon_4",
        "epsilon_5",
    ],
)

print_descriptives_table(
    "c1",
    columns=[
        "epsilon_1",
        "epsilon_2",
        "epsilon_3",
        "epsilon_4",
        "epsilon_5",
    ],
)
print_descriptives_table(
    "c2",
    columns=[
        "epsilon_1",
        "epsilon_2",
        "epsilon_3",
        "epsilon_4",
        "epsilon_5",
    ],
)
print_descriptives_table(
    "c3",
    columns=[
        "epsilon_1",
        "epsilon_2",
        "epsilon_3",
        "epsilon_4",
        "epsilon_5",
    ],
)


# %% Time Taken for the user task

fig, ax = plt.subplots()

landed_c1 = pd.read_csv("dataframes/landed-c1.log.csv").loc[
    :, ["userid", "datetime", "condition"]
]
landed_c2 = pd.read_csv("dataframes/landed-c2.log.csv").loc[
    :, ["userid", "datetime", "condition"]
]
landed_c3 = pd.read_csv("dataframes/landed-c3.log.csv").loc[
    :, ["userid", "datetime", "condition"]
]

landed_condition = pd.concat([landed_c1, landed_c2, landed_c3]).rename(
    columns={"datetime": "condition_start"}
)

landed_condition = (
    landed_condition.loc[landed_condition.userid.isin(accepted_userids.userid)]
    .sort_values(by="condition_start")
    .drop_duplicates(keep="first", subset=["userid"])
)

landed_thanks = (
    pd.read_csv("dataframes/landed-thanks-svg.log.csv")
    .loc[:, ["userid", "datetime"]]
    .rename(columns={"datetime": "condition_end"})
    .sort_values(by="condition_end")
    .drop_duplicates(keep="first", subset=["userid"])
)

time_condition = pd.merge(landed_condition, landed_thanks, how="left", on=["userid"])


time_condition["elapsed_time"] = (
    time_condition.condition_end - time_condition.condition_start
) / 1000

condition_label_mapping = {
    "c1": "Simple",
    "c2": "Visual",
    "c3": "Bayesian",
}

ax = sns.boxplot(
    time_condition, x="condition", y="elapsed_time", width=0.3, order=["c1", "c2", "c3"]
)

fig.suptitle("Time taken for the user task")
ax.set_xlabel("")
ax.set_xticklabels(["Simple", "Visual", "Bayesian"])
ax.set_ylabel("Time taken in seconds")
plt.tight_layout()

plt.savefig("results/plots/time_elapsed.png", dpi=500)


# %% Descriptive violin plots


def violinplot(
    ax, column, column_name_clean=None, title=None, widths=0.3, positions=[1, 2, 3]
):

    ax.violinplot(
        [
            result_df[column].loc[result_df.condition == "c1"],
            result_df[column].loc[result_df.condition == "c2"],
            result_df[column].loc[result_df.condition == "c3"],
        ],
        showmedians=True,
        widths=widths,
        positions=positions,
    )

    ax.set_title(title)
    ax.set_xticks(positions)
    ax.set_xticklabels(["Simple", "Visual", "Bayesian"])
    ax.set_ylabel(column_name_clean)


configs = [
    ["nfc", "NFC", "Need for Cognition"],
    ["iuipc", "IUIPC", "PrivacyConcern"],
    ["ueq_pragmatic", "UEQ Pragmatic Dimension", "UEQPragmatic"],
    ["ueq_hedonic", "UEQ Hedonic Dimension", "UEQHedonic"],
    ["ueq_total", "UEQ Total Score", "UEQ Total Score"],
]

for short_name, long_name, title in configs:
    print(short_name, long_name)
    fig, ax = plt.subplots()
    violinplot(
        ax, short_name, long_name, widths=0.3, positions=[0.4, 1, 1.6], title=title
    )
    plt.savefig(f"results/plots/{short_name}.png", dpi=400)
    plt.show()


# %% Plot Numeracy Groups


def plot_numeracy(ax):
    bar_width = 0.4
    ax = sns.histplot(
        data=result_df,
        x="numeracy",
        # y="condition",
        hue="condition",
        multiple="dodge",
        # kind="hist",
        # shrink=0.8,
        binwidth=bar_width,
        # discrete=True,
        # common_bins=True,
        # legend=False,
    )

    ax.set_xticks(np.array([1, 2, 3, 4]) + (bar_width / 2))
    ax.set_xticklabels(
        ["LowestNumeracy", "LowNumeracy", "HighNumeracy", "HighestNumeracy"],
        rotation=90,
    )
    ax.set_xlim(0, 5)
    ax.set_title("Count of numeracy groups in each condition")


fig, ax = plt.subplots()

plot_numeracy(ax)
ax.set_xlabel("")
plt.savefig(f"results/plots/numeracy_hist.png", dpi=500)
plt.show()


# %% Plot privacy levels for different locations

fig, ax = plt.subplots()

privacy_level_c1 = pd.read_csv("dataframes/finalstate-c1.log.csv").loc[
    :, ["userid", "datetime", "component", "finalstate"]
]
privacy_level_c2 = pd.read_csv("dataframes/finalstate-c2.log.csv").loc[
    :, ["userid", "datetime", "component", "finalstate"]
]
privacy_level_c3 = pd.read_csv("dataframes/finalstate-c3.log.csv").loc[
    :, ["userid", "datetime", "component", "finalstate"]
]

privacy_level = (
    pd.concat([privacy_level_c1, privacy_level_c2, privacy_level_c3])
    .sort_values("datetime")
    .drop_duplicates(subset=["userid"], keep="last")
)

privacy_level = privacy_level.loc[privacy_level.userid.isin(accepted_userids.userid)]

privacy_level["Home"] = privacy_level.finalstate.apply(lambda x: ast.literal_eval(x)[0])
privacy_level["Café"] = privacy_level.finalstate.apply(lambda x: ast.literal_eval(x)[1])
privacy_level["Private Location"] = privacy_level.finalstate.apply(
    lambda x: ast.literal_eval(x)[2]
)
privacy_level["Workplace"] = privacy_level.finalstate.apply(
    lambda x: ast.literal_eval(x)[3]
)
privacy_level["Metro"] = privacy_level.finalstate.apply(
    lambda x: ast.literal_eval(x)[4]
)


privacy_level_melted = privacy_level.loc[
    :, ["component", "Home", "Café", "Private Location", "Workplace", "Metro"]
].melt(id_vars="component", var_name="location")

ax = sns.boxplot(
    data=privacy_level_melted,
    x="location",
    y="value",
    hue="component",
    linewidth=0.5,
    hue_order=["c1", "c2", "c3"],
    width=0.6,
    # labels=["Simple", "Visual", "Bayesian"],
    # positions=[2, 4, 6, 8, 10],
)

fig.suptitle("Chosen privacy levels across conditions")

ax.set_xlabel("")
ax.set_ylabel("Privacy Level")

handles, _ = ax.get_legend_handles_labels()

ax.legend(handles, ["Simple", "Visual", "Bayesian"], loc="upper right")

plt.savefig("results/plots/privacy_levels.png", dpi=500)

plt.show()

# %%
