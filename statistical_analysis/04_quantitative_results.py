# %%
import pandas as pd
from matplotlib.patches import PathPatch
import matplotlib.pyplot as plt
from scipy.stats import (
    mannwhitneyu,
    shapiro,
    levene,
    kruskal,
)
import statsmodels.api as sm

# %%

result_df = pd.read_csv("results/result_df.csv")

c1 = result_df.loc[result_df.condition == "c1", :]
c2 = result_df.loc[result_df.condition == "c2", :]
c3 = result_df.loc[result_df.condition == "c3", :]

print(c1.describe())
print(c2.describe())
print(c3.describe())

c1_c2 = result_df.loc[result_df.condition.isin(["c1", "c2"]), :]
c2_c3 = result_df.loc[result_df.condition.isin(["c3", "c2"]), :]
c1_c3 = result_df.loc[result_df.condition.isin(["c3", "c1"]), :]


df = result_df

for col in ["iuipc", "nfc", "ueq_total", "ueq_pragmatic", "ueq_hedonic"]:
    print(shapiro(df[col]))

# %%

alpha = 0.4
fig, ax = plt.subplots(figsize=(15, 10))


for i, df in zip(range(3), [c1, c2, c3]):

    colors = {
        "c1": "red",
        "c2": "green",
        "c3": "blue",
    }

    ax.scatter(
        df.ueq_pragmatic,
        df.ueq_hedonic,
        c=df.condition.map(colors),
        s=df.numeracy * 20,
        label=f"c{i + 1}",
        alpha=alpha,
    )

    ax.set_xlabel("ueq pragmatic")
    ax.set_ylabel("ueq hedonic")

    ax.legend()

    plt.tight_layout()

plt.savefig(
    f"ueq_scatter",
    dpi=800,
    bbox_inches="tight",
)

plt.show()


# %% Mann-Whitney-U tests

equal_var = False

i = 1


for df_1, df_2 in [[c1, c2], [c2, c3], [c1, c3]]:
    print(f"\n____________________________________________")
    for dim in ["ueq_hedonic", "ueq_pragmatic"]:

        print(f"\nTest {dim}:")

        _, p_value = levene(df_1[dim], df_2[dim])

        if p_value <= 0.05:
            equal_var = False
            print("equal_var = False")
        else:
            equal_var = True

        print(
            mannwhitneyu(
                df_1[dim],
                df_2[dim],
                alternative="less",
            )
        )


# %% Generate Latex Output Tables for Linear Regression Results of Usability Dimensions.


def get_latex_table(
    df, condition, dependent_variable, interaction_term=None, title=None, label=None
):
    mapping = {
        "ueq_hedonic": "UEQ hedonic dimension",
        "ueq_pragmatic": "UEQ pragmatic dimension",
        "ueq_total": "UEQ total score",
        "nfc": "NFC Score",
        "C(numeracy)": "Numeracy Score",
    }

    ols_output = sm.OLS.from_formula(
        formula=f"{dependent_variable} ~ condition*nfc*C(numeracy) - nfc:C(numeracy) - condition:nfc:C(numeracy)",
        data=df,
    ).fit()

    print(f"\\begin{{table}}[]")
    print("    \\centering")
    print(
        ols_output.summary()
        .tables[1]
        .as_latex_tabular()
        .replace("condition[T.c2]", "Visual")
        .replace("condition[T.c3]", "Bayesian")
        .replace("C(numeracy)[T.2]", "LowNumeracy")
        .replace("C(numeracy)[T.3]", "HighNumeracy")
        .replace("C(numeracy)[T.4]", "HighestNumeracy")
        .replace(":", "*")
        .replace("nfc", "NFC")
    )
    print(
        f"\\caption{{OLS Regression Results: {title}. Dependent variable: {mapping[dependent_variable]}.}}"
    )
    print(f"\\label{{tab:{dependent_variable}_{condition}}}")

    print(f"\\end{{table}}")


get_latex_table(c1_c2, "visual", "ueq_hedonic", title="Condition Simple vs. Visual")
get_latex_table(c1_c2, "visual", "ueq_pragmatic", title="Condition Simple vs. Visual")
get_latex_table(c1_c2, "visual", "ueq_total", title="Condition Simple vs. Visual")


get_latex_table(c2_c3, "bayesian", "ueq_hedonic", title="Condition Visual vs. Bayesian")
get_latex_table(
    c2_c3, "bayesian", "ueq_pragmatic", title="Condition Visual vs. Bayesian"
)
get_latex_table(c2_c3, "bayesian", "ueq_total", title="Condition Visual vs. Bayesian")

get_latex_table(c1_c3, "bayesian", "ueq_hedonic", title="Condition Simple vs. Bayesian")
get_latex_table(
    c1_c3, "bayesian", "ueq_pragmatic", title="Condition Simple vs. Bayesian"
)
get_latex_table(c1_c3, "bayesian", "ueq_total", title="Condition Simple vs. Bayesian")


# %% Generate Latex Output Tables for Linear Regression Results of Privacy Levels.

for df, condition, caption_name in zip(
    [c1, c2, c3, c1_c2, c2_c3],
    ["Simple", "Visual", "Bayesian", "Simple vs. Visual", "Visual vs. Bayesian"],
    ["simple", "visual", "bayesian", "simple_visual", "visual_bayesian"],
):
    print(f"\\begin{{table}}[]")
    print("    \\centering")
    print(
        sm.OLS.from_formula(formula=f"epsilon_mean ~ condition*iuipc", data=df)
        .fit()
        .summary()
        .tables[1]
        .as_latex_tabular()
        .replace("iuipc", "PrivacyConcern")
        .replace("condition[T.c2]", "Visual")
        .replace("condition[T.c3]", "Bayesian")
        .replace(":", "*")
    )
    print(
        f"\\caption{{Dependent variable: PrivacyLevel. Linear regression results for {condition}.}}"
    )
    print(f"\\label{{tab:privacy_level_{caption_name}_iuipc}}")

    print(f"\\end{{table}}")
