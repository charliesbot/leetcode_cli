
package(default_visibility = ["//visibility:public"])
load("@rules_cc//cc:defs.bzl", "cc_test")
load("@com_grail_bazel_compdb//:aspects.bzl", "compilation_database")

cc_library(
    name="exercises",
    hdrs=glob(["**/**/*.h"]),
    srcs = glob(
        ["**/**/*.cc"],
        exclude = ["**/**/*test.cc"]
    ),
    visibility = ["//visibility:public"],
)

cc_test(
  name = "tests",
  srcs = glob(["**/**/*_test.cc"]),
  testonly = False,
  deps = [
      ":exercises",
      "@com_google_googletest//:gtest_main"
      ],
)

compilation_database(
    name = "compilation_db",
    targets = [
        ":exercises",
        ":tests"
    ],
)
