# Universal Preference Exploration

Accompanying repository for the experimental study conducted in _Bayesian Human-in-the-Loop Optimization for Universal Preference Exploration_.

## Interaction Design

Please use the steps described here in order to run the applications. Dockerfiles were used for the Live setting but not optimized for the development setting.

### Development Mode

Prerequisites: If you want run see the study with full functionality, you need to create a Google Maps API key first. This can be done here: [https://developers.google.com/maps/documentation/javascript/get-api-key]

Set the APIKEY as environment variable:

```
export APIKEY=<YOUR_APIKEY>
```

In order to run the application locally follow the following steps:

Run from `interaction_design/frontend` folder:

```
npm install
```

And start the development server:

```
npm run dev
```

To run the Flask REST API, run from `interaction_design/backend` folder (only needed for first setup):

```
python -m venv .venv
```

```
source .venv/bin/activate
```

```
pip install -r requirements.txt
```

To start the Flask application:

(API Keys must be set)

```
flask --app api run
```

### Reaching the interfaces

In order to have a _shortcut_ to the three interfaces, follow these steps.

1. Go to the start page of the study, usually at localhost:3000
2. Type in a random ID (in the live setting participants should not reach further pages without providing the ID)
3. Follow one of the following links:

- _Simple_: http://localhost:3000/static/c1
- _Visual_: http://localhost:3000/static/c2
- _Bayesian_: http://localhost:3000/static/c3
