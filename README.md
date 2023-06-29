[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/AmaliTech-Training-Academy/gitinspired-backend-june.git">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZC2u9cjLenMvYSkWUf2yLLbB_3eaACPJaYKd3c6dz-5IVnCq83YTPZVVV4d-pkB_hF6E&usqp=CAU" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Git Inspired Assignment Submission System</h3>

  <p align="center">
    project_description
    <br />
    <a href="https://gitinspired-api.amalitech-dev.net/api/docs/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://gitinspired.amalitech-dev.net">View Demo</a>
    ·
    <!-- <a href="https://github.com/AmaliTech-Training-Academygitinspired-backend-june/issues">Report Bug</a> -->
    ·
    <!-- <a href="https://github.com/AmaliTech-Training-Academy/gitinspired-backend-june/issues">Request Feature</a> -->
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#commands">Commands</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Assignment Submission System]](https://www.amalitech.com)

### Built With

- [React Typescript]()
- [NodeJs]()

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm

  ```sh
  npm install -g yarn
  ```

- docker

  ```sh
  https://www.docker.com/products/docker-desktop
  ```

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/AmaliTech-Training-Academy/gitinspired-backend-june.git

   ```

2. Initialize git

  ```sh
 git init
 ```

3. Initialize npm

   ```sh
    npm init
    ```

4. Install NPM packages

   ```sh
   yarn install
   ```

5. Environment variables

   ```sh
     create a .env
     copy variables from example.env to .env
     change values to correct values
   ```

   <!-- USAGE EXAMPLES -->

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://gitinspired-api.amalitech-dev.net/api/docs/)_

<!-- COMMANDLINE -->

## Commands

- build dev

  ```sh
    docker build -f Dockerfile.dev -t .
  ```

- build prod

  ```sh
    docker build -f Dockerfile.prod -t .
  ```

- run dev

  ```sh
    docker-compose -f docker-compose.dev.yaml up -d
  ```

- run prod

  ```sh
    docker-compose -f docker-compose.prod.yaml up -d
  ```

- stop dev

  ```sh
    docker-compose -f docker-compose.dev.yaml down
  ```

- stop prod

  ```sh
    docker-compose -f docker-compose.prod.yaml down
  ```

- exec (Get access into the container)

  ```sh
    docker exec -it ${container-id} sh
  ```

- docker dev log

  ```sh
    docker-compose -f docker-compose.dev.yaml logs
  ```

- docker prod log

  ```sh
    docker-compose -f docker-compose.prod.yaml logs
  ```

- single-log:

  ```sh
  docker-compose -f docker-compose.dev.yaml logs ${service-name}
  ```

- docker services:

  ```sh
    docker-compose -f ${compose file} service
  ```

- docker tail logs:

  ```sh
    docker-compose -f ${compose-file} logs ${service-name} --tail ${count}
  ```

  <!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/AmaliTech-Training-Academy/gitinspired-backend-june/issues) for a list of proposed features (and known issues).

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Amali-Tech Training Academy - [Email](takoraditrainingcenter@amalitech.org)

Project Link: [Assignment Submission System](https://github.com/AmaliTech-Training-Academy/gitinspired-backend-june.git)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [AmaliTech Training Academy](https://www.amalitech.org)
- [AmaliTech Service Centre](https://www.amalitech.org)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/AmaliTech-Training-Academy/Assignment-Submission-System.svg?style=for-the-badge
[contributors-url]: https://github.com/AmaliTech-Training-Academy/Assignment-Submission-System/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/AmaliTech-Training-Academy/Assignment-Submission-System.svg?style=for-the-badge
[forks-url]: https://github.com/AmaliTech-Training-Academy/Assignment-Submission-System/network/members
[stars-shield]: https://img.shields.io/github/stars/AmaliTech-Training-Academy/Assignment-Submission-System.svg?style=for-the-badge
[stars-url]: https://github.com/AmaliTech-Training-Academy/Assignment-Submission-System/stargazers
[issues-shield]: https://img.shields.io/github/issues/AmaliTech-Training-Academy/Assignment-Submission-System.svg?style=for-the-badge
[issues-url]: https://github.com/AmaliTech-Training-Academy/Assignment-Submission-System/issues
[license-shield]: https://img.shields.io/github/license/AmaliTech-Training-Academy/Assignment-Submission-System.svg?style=for-the-badge
[license-url]: https://github.com/AmaliTech-Training-Academy/Assignment-Submission-System/blob/main/LICENSE.md

```

```
