# %%
import ast
import pandas as pd
import numpy as np

###### This script is cannot be run, as for the GitHub Upload every participant identifying information was removed, including the ProlificID
###### The "userid", which was generated in the interface, was kept.
###### If you wish to reproduce results, please start with the next script in the numeration.

df_dir = "./dataframes"

######################################
# IUIPC Questions

attentionCheckItem = 'Damit wir wissen, dass Sie die Fragen gelesen haben, wählen sie bitte die Antwortmöglichkeit "Stimme eher zu" aus. Dies ist ein Aufmerksamkeitstests.'
correctAnswerIndexAC = 1  # Index for attention check

iuipcItemsWithAttentionCheckSorted = [
    "Beim Online-Datenschutz für Verbraucher:innen geht es in erster Linie um das Recht der Verbraucher:innen, Kontrolle und Autonomie über Entscheidungen auszuüben, wie persönliche Informationen gesammelt, verwendet und weitergegeben werden.",
    'Damit wir wissen, dass Sie die Fragen gelesen haben, wählen sie bitte die Antwortmöglichkeit "Stimme eher zu" aus. Dies ist ein Aufmerksamkeitstests.',
    "Die Kontrolle der Verbraucher:innen über ihre persönlichen Informationen ist die Kernaufgabe des Datenschutzes.",
    "Eine gute Online-Datenschutzrichtlinie für Verbraucher:innen sollte  klar formuliert und auffällig platziert sein.",
    "Es ist mir sehr wichtig, dass ich bewusst und sachkundig darüber informiert bin, wie meine persönlichen Informationen verwendet werden.",
    "Es stört mich, so vielen Online-Unternehmen persönliche Informationen zu geben.",
    "Ich bin besorgt, dass Online-Unternehmen zu viele persönliche Informationen über mich sammeln.",
    "Ich glaube, dass die Online-Privatsphäre durch eine Marketingmaßnahme verletzt wird, wenn Kontrolle verloren geht oder ungewollt reduziert wird.",
    "Normalerweise stört es mich, wenn Online-Unternehmen mich nach persönlichen Informationen fragen.",
    "Unternehmen, die Online Informationen einholen, sollten offenlegen, wie die Daten gesammelt, verarbeitet und genutzt werden.",
    "Wenn mich Online-Unternehmen nach persönlichen Informationen fragen, überlege ich manchmal zweimal, bevor ich sie angebe.",
]

######################################
# NFC Questions

# (Reversed)    "Denken entspricht nicht dem, was ich unter Spaß verstehe.",
#               "Die Aufgabe, neue Lösungen für Probleme zu finden, macht mir wirklich Spaß.",
# (Reversed)    "Ich trage nicht gerne die Verantwortung für eine Situation, die sehr viel Denken erfordert.",
#               "Ich würde komplizierte Probleme einfachen Problemen vorziehen.",
#               "Ich würde lieber eine Aufgabe lösen, die Intelligenz erfordert, schwierig und bedeutend ist, als eine Aufgabe, die zwar irgendwie wichtig ist, aber nicht viel Nachdenken erfordert.",
# (Reversed)    "Ich würde lieber etwas tun, das wenig Denken erfordert, als etwas, das mit Sicherheit meine Denkfähigkeit herausfordert.",

nfcItemsWithAttentionCheckSorted = [
    'Damit wir wissen, dass Sie die Fragen gelesen haben, wählen sie bitte die Antwortmöglichkeit "Stimme eher nicht zu" aus. Dies ist ein Aufmerksamkeitstests.',
    "Denken entspricht nicht dem, was ich unter Spaß verstehe.",
    "Die Aufgabe, neue Lösungen für Probleme zu finden, macht mir wirklich Spaß.",
    "Ich trage nicht gerne die Verantwortung für eine Situation, die sehr viel Denken erfordert.",
    "Ich würde komplizierte Probleme einfachen Problemen vorziehen.",
    "Ich würde lieber eine Aufgabe lösen, die Intelligenz erfordert, schwierig und bedeutend ist, als eine Aufgabe, die zwar irgendwie wichtig ist, aber nicht viel Nachdenken erfordert.",
    "Ich würde lieber etwas tun, das wenig Denken erfordert, als etwas, das mit Sicherheit meine Denkfähigkeit herausfordert.",
]

#####################################
# UEQ dimensions

ueq_pragmatic = ["behindernd", "kompliziert", "ineffizient", "verwirrend"]
ueq_hedonic = ["langweilig", "uninteressant", "konventionell", "herkömmlich"]

# %% Get a List of all unique ProlificID from the logs

prolific_ids_1 = (
    pd.read_csv("dis_60.csv")
    .rename(columns={"Participant id": "prolificid"})
    .prolificid
)

prolific_ids_2 = (
    pd.read_csv("dis_70.csv")
    .rename(columns={"Participant id": "prolificid"})
    .prolificid
)

prolific_ids_3 = (
    pd.read_csv("dis_98.csv")
    .rename(columns={"Participant id": "prolificid"})
    .prolificid
)

prolific_ids_4 = (
    pd.read_csv("dis_100.csv")
    .rename(columns={"Participant id": "prolificid"})
    .prolificid
)

participated_double = pd.concat(
    [
        prolific_ids_1.loc[prolific_ids_1.isin(prolific_ids_3)],
        prolific_ids_2.loc[prolific_ids_2.isin(prolific_ids_3)],
    ]
)

prolific_ids_concat = pd.concat(
    [prolific_ids_1, prolific_ids_2, prolific_ids_3, prolific_ids_4], axis=0
)

prolific_ids = prolific_ids_concat.unique()


# %% Attention Checks

wrongtrie = (
    pd.read_csv("dataframes/wrongtrie.log.csv").groupby("userid").sum().reset_index()
)


ac_failed = pd.read_csv("dataframes/warning-ac-failed.log.csv")

exclude = pd.concat(
    [
        wrongtrie.userid.loc[wrongtrie.noOfTrie >= 2],
        ac_failed.userid.loc[ac_failed.prolificid.str.len() == 24],
    ]
)

s1 = pd.read_csv("dataframes/freetext-s1.log.csv")


s1 = s1.loc[s1.prolificid.isin(prolific_ids)]

s1 = s1.sort_values(by="datetime")

s1 = s1.drop_duplicates(subset=["userid"], keep="last")

accept_duplicated = s1.loc[s1.prolificid.duplicated()]
accept_duplicated["date"] = pd.to_datetime(s1["datetime"])

s1 = s1.drop_duplicates(subset=["prolificid"], keep="first")

excluded_users = s1.loc[s1.userid.isin(exclude)]

s1 = s1.loc[~s1.userid.isin(exclude)]

users = s1  # Successfull submissions needed to pass the scenario pages

# %% Read questionnaire answers

iuipc = (
    pd.read_csv("dataframes/final-answers-iuipc.log.csv")
    .sort_values("datetime")
    .drop_duplicates(subset=["userid"], keep="last")
)

nfc = (
    pd.read_csv("dataframes/final-answers-nfc.log.csv")
    .sort_values("datetime")
    .drop_duplicates(subset=["userid"], keep="last")
)

ueq = (
    pd.read_csv("dataframes/final-answers-ueqs.log.csv")
    .sort_values("datetime")
    .drop_duplicates(subset=["userid"], keep="last")
)


numeracy = (
    pd.read_csv("dataframes/final-answers-numeracy.log.csv")
    .sort_values("datetime")
    .drop_duplicates(subset=["userid"], keep="last")
    .rename(columns={"answer": "numeracyAnswers"})
    .loc[:, ["userid", "numeracyAnswers"]]
)


def get_sorted_answers(df, metricName):
    """Questionnaire items are randomly shuffled. This function orders questions and answers."""

    question_list = []
    answer_list = []
    userid_list = []
    condition_list = []

    for userid, condition, questionListString, answerListString in zip(
        df.userid, df.condition, df.shuffledquestions, df.answers
    ):

        if metricName == "ueq":
            questionList = [x[0] for x in ast.literal_eval(questionListString)]
        else:
            questionList = ast.literal_eval(questionListString)
        answerList = ast.literal_eval(answerListString)

        if not isinstance(questionList, list) or not isinstance(answerList, list):
            print("here")
            print(questionListString)
            print(answerListString)

        else:
            # print(len(questionList))

            sortedIndex = np.argsort(questionList)
            # print(sortedIndex)
            answers = np.array(answerList)[sortedIndex]
            questions = np.array(questionList)[sortedIndex]

            answer_list.append(answers.tolist())
            question_list.append(questions.tolist())
            userid_list.append(userid)
            condition_list.append(condition)

    return pd.DataFrame(
        {
            "userid": userid_list,
            "condition": condition_list,
            f"{metricName}AnswersSorted": answer_list,
            f"{metricName}QuestionsSorted": question_list,
        }
    )


#%% Concat all answers into one DataFrame.

iuipc_df = get_sorted_answers(iuipc, "iuipc")
nfc_df = get_sorted_answers(nfc, "nfc")
ueq = get_sorted_answers(ueq, "ueq")
ueq.ueqAnswersSorted = ueq.ueqAnswersSorted.apply(lambda x: [int(a) for a in x])

result_df = (
    iuipc_df.merge(nfc_df, on=["userid", "condition"]).merge(ueq).merge(numeracy)
)


#%% Calculate Questionnaire Metrics


def calc_iuipc(answer_list):
    if len(answer_list) != 11:
        raise ValueError

    else:
        # print(type(answer_list))
        answer_list.pop(1)
        return np.mean([int(x) for x in answer_list])
    # return 1


def calc_nfc(answer_list):
    if len(answer_list) != 7:
        raise ValueError

    else:
        # print(type(answer_list))
        answer_list.pop(0)
        answer_list = [int(x) for x in answer_list]

        nfc_score = []
        for index, a in enumerate(answer_list):
            if index in [0, 2, 5]:
                nfc_score.append(8 - a)
            else:
                nfc_score.append(a)

    return np.mean(nfc_score)


def calc_numeracy(answer_list):
    """
    ['25', '30', '20', '50']
    """
    answers = ast.literal_eval(answer_list)

    if answers[2]:
        if answers[2] == "20":
            return 4

    if answers[3]:
        if answers[3] != "50":
            return 3
        elif answers[3] == "50":
            return 4

    if answers[1]:
        if answers[1] != "30":
            return 1
        elif answers[1] == "30":
            return 2

    raise ValueError


def calc_ueq_pragmatic(answer_list):
    boolean_indexer_sorted = [True, False, True, True, False, False, False, True]

    pragmatic_score = np.mean(np.array(answer_list)[boolean_indexer_sorted])

    return pragmatic_score


def calc_ueq_hedonic(answer_list):
    boolean_indexer_sorted = [False, True, False, False, True, True, True, False]

    hedonic_score = np.mean(np.array(answer_list)[boolean_indexer_sorted])

    return hedonic_score


def calc_ueq_total(answer_list):
    ueq_score = np.mean(np.array(answer_list))
    return ueq_score


result_df["iuipc"] = result_df.iuipcAnswersSorted.apply(lambda x: calc_iuipc(x))
result_df["nfc"] = result_df.nfcAnswersSorted.apply(lambda x: calc_nfc(x))
result_df["numeracy"] = result_df.numeracyAnswers.apply(lambda x: calc_numeracy(x))
result_df["ueq_pragmatic"] = result_df.ueqAnswersSorted.apply(
    lambda x: calc_ueq_pragmatic(x)
)
result_df["ueq_hedonic"] = result_df.ueqAnswersSorted.apply(
    lambda x: calc_ueq_hedonic(x)
)
result_df["ueq_total"] = result_df.ueqAnswersSorted.apply(lambda x: calc_ueq_total(x))


# %% Add chosen Privacy Levels to the result_df

epsilon = pd.concat(
    [
        pd.read_csv("dataframes/finalstate-c1.log.csv"),
        pd.read_csv("dataframes/finalstate-c2.log.csv"),
        pd.read_csv("dataframes/finalstate-c3.log.csv"),
    ]
)

epsilon["epsilon_mean"] = epsilon.finalstate.apply(
    lambda x: np.mean(ast.literal_eval(x))
)
epsilon["epsilon_1"] = epsilon.finalstate.apply(lambda x: ast.literal_eval(x)[0])
epsilon["epsilon_2"] = epsilon.finalstate.apply(lambda x: ast.literal_eval(x)[1])
epsilon["epsilon_3"] = epsilon.finalstate.apply(lambda x: ast.literal_eval(x)[2])
epsilon["epsilon_4"] = epsilon.finalstate.apply(lambda x: ast.literal_eval(x)[3])
epsilon["epsilon_5"] = epsilon.finalstate.apply(lambda x: ast.literal_eval(x)[4])


epsilon = epsilon.sort_values("datetime").drop_duplicates("userid", keep="last")

result_df = result_df.merge(
    epsilon.loc[
        :,
        [
            "userid",
            "epsilon_mean",
            "epsilon_1",
            "epsilon_2",
            "epsilon_3",
            "epsilon_4",
            "epsilon_5",
        ],
    ]
)

# %% Save Results to File.

result_df = result_df.loc[result_df.userid.isin(s1.userid)]
print(result_df.condition.value_counts())
result_df.to_csv("./results/result_df.csv")

# Save accepted userids
result_df.userid.to_csv("results/accepted_userids.csv", index=False)

# %% Calculate Rejected Submissions.

dis_60 = pd.read_csv("dis_60.csv")
dis_70 = pd.read_csv("dis_70.csv")
dis_98 = pd.read_csv("dis_98.csv")
dis_100 = pd.read_csv("dis_100.csv")
dis_60["bulk"] = "60"
dis_70["bulk"] = "70"
dis_98["bulk"] = "98"
dis_100["bulk"] = "100"

dis_submissions = pd.concat([dis_60, dis_70, dis_98, dis_100])

dis_submissions = dis_submissions.sort_values(by="Completed at")

duplicated_submissions = dis_submissions.loc[
    dis_submissions["Participant id"].duplicated(keep=False)
]

duplicated_submissions.sort_values(by="Completed at")

reject = duplicated_submissions.loc[
    ~duplicated_submissions["Participant id"].isin(accept_duplicated.prolificid)
]

reject = reject.loc[reject["Participant id"].duplicated(keep="first")]


exclude = dis_submissions.loc[
    dis_submissions["Participant id"].isin(excluded_users.prolificid)
]


reject_ids = pd.concat([reject["Participant id"], exclude["Participant id"]])


accept_dis_98 = dis_98.loc[~dis_98["Participant id"].isin(reject_ids)]

# %%
