### BackStage JS

[BackstageJS](https://backstage.io/docs/overview/what-is-backstage) is an open source framework for building developer portals.
It is powered by a centralized software catalog.
\nl
It was created by [Spotify](https://www.spotify.com/) out of necesity. [See more](https://backstage.io/docs/overview/background)

 

#### Architecture overview

##### Terminology

Backstage is organized into three main components, each catering to different groups of contributors who interact with Backstage in distinct ways.

\nl
**Core** - This includes the base functionality developed by core developers within the open-source project.

\nl
**App** - The app represents a deployed instance of a Backstage application, customized and maintained by app developers, typically a productivity team within an organization. It integrates core functionalities with additional plugins.

\nl
**Plugins** - These provide additional functionalities to enhance the usefulness of your Backstage app. Plugins can be company-specific or open-sourced and reusable. At Spotify, we have over 100 plugins created by more than 50 different teams, significantly enriching the unified developer experience by incorporating contributions from various infrastructure teams.

\nl
For more infor regarding the **architecture overview** see [here](https://backstage.io/docs/overview/architecture-overview)



#### Pacake Architecture

Backstage relies heavily on NPM packages, both for distribution of libraries, and structuring of code within projects. There
are some established patterns to follow. 
\nl
This is an overview of the package architecture of **Backstage**:
[Package Architecture](./img/package-architecture.drawio-15aac8979d89a6c2f7eb24f04d8d3b32.svg)


The **app** and **backend** packages are the entry points of a Backstage project. The app package is the frontend application that brings together a collection of frontend plugins and customizes them to fit an organization, while the backend package is the backend service that powers the Backstage application. Worth noting is that there can be more than one instance of each of these packages within a project. Particularly the backend packages can benefit from being split up into smaller deployment units that each serve their own purpose with a smaller collection of plugins.


##### Plugin Packages

A typical plugin consits of up to five packages, two **frontend** ones, two **backend** and one isomorphic package. All packages within the plugin must share a common prefix, typically of the form @<scope>/plugin-<plugin-id>, but alternatives like backstage-plugin-<plugin-id> or @<scope>/backstage-plugin-<plugin-id> are also valid. Along with this prefix, each of the packages have their own unique suffix that denotes their role. In addition to these five plugin packages it's also possible for a plugin to have additional frontend and backend modules that can be installed to enable optional features. For a full list of suffixes and their roles, see the [Plugin Package Structure ADR](https://backstage.io/docs/architecture-decisions/adrs-adr011/).

##### Frontend Packages

The frontend packages are grouped into two main groups. The first one is "Frontend App Core", which is the set of packages that are only used by the app package itself. These packages help build up the core structure of the app as well as provide a foundation for the plugin libraries to rely upon.

\nl

The second group is the rest of the shared packages, further divided into **"Frontend Plugin Core"** and **"Frontend Libraries"**. The core packages are considered particularly stable and form the core of the frontend framework. Their most important role is to form the boundary around each plugin and provide a set of tools that helps you combine a collection of plugins into a running application. The rest of the frontend packages are more traditional libraries that serve as building blocks to create plugins.

##### Backend Packages

The backend library packages do not currently share a similar plugin architecture as the frontend packages. They are instead simply a collection of building blocks and patterns that help you build backend services. This is however likely to change in the future.

##### Common Packages

The common packages are the packages effectively depended on by all other pages. This is a much smaller set of packages but they are also very pervasive. Because the common packages are **isomorphic** and must execute both in the **frontend** and **backend**, they are never allowed to depend on any of the frontend or backend packages.

\nl

The [Backstage CLI](https://backstage.io/docs/tooling/cli/commands/) is in a category of its own and is depended on by virtually all other packages. It's not a library in itself though, and must always be a development dependency only.

##### Deciding where you place your code

It can sometimes be difficult to decide where to place your plugin code. For example should it go directly in the **-backend** plugin package or in the **-node** package? As a general guideline you should try to keep the exposure of your code as low as possible. If it doesn't need to be public API, it's best to avoid. If you don't need it to be used by other plugins, then keep it directly in the plugin packages.

[Placement code](./img/package-decision.drawio-c91bae580f0f2534f0582b38d288ed1e.svg)


##### Database

The Backstage backend and its built-in plugins are based on the [Knex](https://knexjs.org/) library, and set up a separate logical database per plugin. This gives great isolation and lets them perform migrations and evolve separately from each other.


##### Cache

The Backstage backend and its built-in plugins are also able to leverage cache stores as a means of improving performance or reliability. Similar to how databases are supported, plugins receive logically separated cache connections, which are powered by [Keyv](https://github.com/lukechilds/keyv) under the hood.

\nl

At this time of writing, Backstage can be configured to use one of five cache stores: memory, which is mainly used for local testing, memcache, redis, valkey or infinispan, which are cache stores better suited for production deployment. The right cache store for your Backstage instance will depend on your own run-time constraints and those required of the plugins you're running.


##### Use memory for cache

pre.conr
backend:
  cache:
    store: memory
pre.conr

##### Use memcache for cache

pre.conr
backend:
  cache:
    store: memcache
    connection: user:pass@cache.example.com:11211
pre.conr


##### Use Redis for cache

pre.conr
backend:
  cache:
    store: redis
    connection: redis://user:pass@cache.example.com:6379
pre.conr

For more info [see here](https://backstage.io/docs/overview/architecture-overview#cache)


### Backstage Software Catalog

#### What is a Software Catalog?

The Backstage Software Catalog is a centralized system that keeps track of ownership and metadata for all the software in your ecosystem (services, websites, libraries, data pipelines, etc). The catalog is built around the concept of [metadata YAML files](https://backstage.io/docs/features/software-catalog/descriptor-format/) stored together with the code, which are then harvested and visualized in Backstage.

\nl

The catalog entity descriptor is a file, it can be named anything but it is recommended to name it _catalog-info.yaml_ and this file supports substitutions in the description format using placeholders like: _$json_, _$text_ and _yaml_, and it will subsequently insert the placeholder values into the definition of an entity. [See more](https://backstage.io/docs/features/software-catalog/descriptor-format/#overall-shape-of-an-entity)

\nl 

The catalog makes it easy for teams to manage their services. It serves twon main use-cases:

\nl

1. Helps teams manage and maintain the software they own, teams get a uniform view of all their software, services, libraries, websites, ML models, etc..

\nl

2. Makes al the software discoverable

\nl

The catalog is available at the _/catalog_ route.


#### Adding components to the catalog:


The source of truth for the components in your software catalog are [metadata YAML](https://backstage.io/docs/features/software-catalog/descriptor-format) files stored in source control (GitHub, GitHub Enterprise, GitLab, ...). Repositories can include one or multiple metadata files. Usually the metadata file is located in the repository root. This is not a formal requirement & metadata files can be placed anywhere in the repository.

\nl

There are 3 ways to add components to the catalog:

\nl

1. Manually register components (we use the _/create_ route for that)

\nl

2. We can create new components through backstage.

\nl 

For instance we can create [Components](https://backstage.io/docs/features/software-catalog/system-model) inside Backstage using [backstage software templates](https://backstage.io/docs/features/software-templates/) or we can also use [static configuration](https://backstage.io/docs/conf/)


3. Integrating with an [external source](https://backstage.io/docs/features/software-catalog/external-integrations/)