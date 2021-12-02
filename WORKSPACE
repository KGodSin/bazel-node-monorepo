# Bazel workspace created by @bazel/create 4.4.6

# Declares that this directory is the root of a Bazel workspace.
# See https://docs.bazel.build/versions/main/build-ref.html#workspace
workspace(
    # How this workspace would be referenced with absolute labels from another workspace
    name = "snowball",
    # Map the @npm bazel workspace to the node_modules directory.
    # This lets Bazel use the same node_modules as other local tooling.
    managed_directories = {"@npm": ["node_modules"]},
)
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

load("//tools:bazel_deps.bzl", "fetch_dependencies")

fetch_dependencies()

# The npm_install rule runs yarn anytime the package.json or package-lock.json file changes.
# It also extracts any Bazel rules distributed in an npm package.



http_archive(
    name = "vendored_node_16_13_1",
    build_file_content = """exports_files(["node-v16.13.1-linux-x64/bin/node"])""",
    # sha256 = "4eba2e9a6db95745b769915d58e57df6ca6724ec1f023f76556fce30ceca2367",
    urls = ["https://nodejs.org/dist/v16.13.1/node-v16.13.1-linux-x64.tar.xz"],
)


http_archive(
    name = "vendored_yarn_1_22",
    build_file_content = """exports_files(["vendored_yarn_1_22/yarn-v1.22.17/bin/yarn.js"])""",
    urls = ["https://github.com/yarnpkg/yarn/releases/download/v1.22.17/yarn-v1.22.17.tar.gz"],
)


load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")


node_repositories(
    node_version = "16.13.1",
    vendored_node = "@vendored_node_16_13_1//:node-v16.13.1-linux-x64",
    vendored_yarn = "@vendored_yarn_1_22//:yarn-v1.22.17",
)

yarn_install(
    name = "npm",
    data = [
        "@vendored_node_16_13_1//:node-v16.13.1-linux-x64/bin/node",
        "@vendored_yarn_1_22//:yarn-v1.22.17/bin/yarn.js",
    ],
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)
