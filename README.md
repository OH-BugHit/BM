# Breakable Machine

Breakable Machine is a web-based classroom
game designed to foster AI literacy through play and experimentation.

In Breakable Machine Students interact with an image classification model, exploring how confidence, correctness, and feature sensitivity work in practice

By intentionally “breaking” the model, learners gain insight into AI vulnerabilities, explainability, and the real-world impact of misclassification.

Breakable Machine is available at [spoof.gen-ai.fi](https://spoof.gen-ai.fi)

## Background

This application is developed as a part of the [Generation AI](https://www.generation-ai-stn.fi) research project in Finland

### Citation

_Hilke, O., Pope, N., Kahila, J., Vartiainen, H., Roos, T., Parkki, T., &
Tedre, M. (2026). Breakable Machine: A K–12 Classroom Game for
Transformative AI Literacy Through Spoofing and eXplainable AI (XAI).
Proceedings of the AAAI Conference on Artificial Intelligence, 40(47),
40762-40770_<br>
https://doi.org/10.1609/aaai.v40i47.41525
<br>
<br>
_Hilke, O., Pope, N., Kahila, J., Vartiainen, H., Roos, T., Parkki, T., &
Tedre, M. (2025). Failure as a Learning Opportunity in AI Literacy. In Proceedings of the 25th Koli Calling International Conference on Computing Education Research (Koli Calling '25). Association for Computing Machinery, New York, NY, USA, Article 53, 1–3._<br>
https://doi.org/10.1145/3769994.3770062

## Installation

This is a [React](https://react.dev/) web application that is developed within Node.js using `npm`. If you wish to build your own deployment you will need Node.js installed on your machine.

Steps to install and build:

1. Download the source code from Github.
2. `npm install`
3. `npm run build`
4. Copy the contents of the `dist` folder to a web server.

For the Peer-2-Peer functionality, some environment variables need to be configured to point to your own server. Please contact us if you need help creating your own server, based around the PeerJS package. A simple server example is provided [here](https://github.com/knicos/genai-server).
