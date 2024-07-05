load("@npm//@bazel/typescript:index.bzl", "ts_project", "ts_config")
load("//tools:index.bzl", "jest_test")

exports_files(["tsconfig.json"])

ts_config(
    name = "tsconfig",
    src = "tsconfig.json",
)

ts_project(
    name = "ts_exercises",
    srcs = glob(
        ["**/**/*.ts"],
        exclude = ["**/**/*.test.ts"]
    ),
    visibility = ["//visibility:public"],
    tsconfig = ":tsconfig.json"
)

jest_test(
    name = "ts_tests",
    srcs = glob(["**/**/*.ts"]),
    config_file = "jest.ts.config.js",
    deps = [":tsconfig.json"],
)
