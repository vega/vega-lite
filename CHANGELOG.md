

# [5.17.0](https://github.com/vega/vega-lite/compare/v5.16.3...v5.17.0) (2024-03-12)


### Bug Fixes

* add markDef.tooltip for interactive check ([#9237](https://github.com/vega/vega-lite/issues/9237)) ([3891832](https://github.com/vega/vega-lite/commit/3891832bc50e8d94cbdc0756b4ef26f860477866)), closes [#9190](https://github.com/vega/vega-lite/issues/9190) [/github.com/vega/vega-lite/blob/ffec017f638103c37d0dbe72cac7d44f4f44b9d6/src/compile/mark/mark.ts#L377-L381](https://github.com//github.com/vega/vega-lite/blob/ffec017f638103c37d0dbe72cac7d44f4f44b9d6/src/compile/mark/mark.ts/issues/L377-L381)
* duplicate sorting in stack ([#9213](https://github.com/vega/vega-lite/issues/9213)) ([3e35dc2](https://github.com/vega/vega-lite/commit/3e35dc22ec50489fc46eb875a9cbfdfd2c4e28f2)), closes [#8033](https://github.com/vega/vega-lite/issues/8033)
* fix typo in time unit 'weekdayhours' ([#9206](https://github.com/vega/vega-lite/issues/9206)) ([12788a5](https://github.com/vega/vega-lite/commit/12788a59a4c8313f56c0558163c26b3dce07756d))
* mark sequential scales as deprecated ([#9212](https://github.com/vega/vega-lite/issues/9212)) ([93a44db](https://github.com/vega/vega-lite/commit/93a44db5757787044942c3f09964524183797463)), closes [#9017](https://github.com/vega/vega-lite/issues/9017)
* remove default opacity if fillOpacity is set ([#9238](https://github.com/vega/vega-lite/issues/9238)) ([98ba02d](https://github.com/vega/vega-lite/commit/98ba02d7624fcdf9dd90661fca2f3ffd1f11e7ff)), closes [#9137](https://github.com/vega/vega-lite/issues/9137) [#9163](https://github.com/vega/vega-lite/issues/9163)
* revert [#9253](https://github.com/vega/vega-lite/issues/9253) ([#9267](https://github.com/vega/vega-lite/issues/9267)) ([9da3ecb](https://github.com/vega/vega-lite/commit/9da3ecbd35b76f99c202518e67e76e9c9c9cca04))
* support arrays in color schemes ([#9262](https://github.com/vega/vega-lite/issues/9262)) ([d86c90e](https://github.com/vega/vega-lite/commit/d86c90eb80eb736faca18a009e096d9d5450b5e1)), closes [#9022](https://github.com/vega/vega-lite/issues/9022)
* update deps and resolve issue with images in docs ([#9210](https://github.com/vega/vega-lite/issues/9210)) ([fc94297](https://github.com/vega/vega-lite/commit/fc942975c125ebcc9d7cd6b2439adb88a1fa9f9a))
* use child signal for radius if faceted ([#9232](https://github.com/vega/vega-lite/issues/9232)) ([e11af45](https://github.com/vega/vega-lite/commit/e11af455edfd11d992838a51cf842a20a6cd0069)), closes [#8754](https://github.com/vega/vega-lite/issues/8754) [/github.com/vega/vega-lite/blob/c33f46bad7f80f779e463a8a36481f888f18e222/src/compile/scale/range.ts#L311-L314](https://github.com//github.com/vega/vega-lite/blob/c33f46bad7f80f779e463a8a36481f888f18e222/src/compile/scale/range.ts/issues/L311-L314)


### Features

* 'move' cursor added over brush mark ([#9164](https://github.com/vega/vega-lite/issues/9164)) ([ffec017](https://github.com/vega/vega-lite/commit/ffec017f638103c37d0dbe72cac7d44f4f44b9d6))
* add support for signals in mark clip ([#9282](https://github.com/vega/vega-lite/issues/9282)) ([bf14024](https://github.com/vega/vega-lite/commit/bf140243e51cb45a516a9fef77f93790ddb8389b))
* update Vega and other deps ([#9182](https://github.com/vega/vega-lite/issues/9182)) ([e3a6232](https://github.com/vega/vega-lite/commit/e3a6232e0fee0802edbbc5cf4180c359ea72f1bf))

## [5.16.3](https://github.com/vega/vega-lite/compare/v5.16.2...v5.16.3) (2023-11-10)


### Bug Fixes

* make isRectWithOffset check consistent ([#9169](https://github.com/vega/vega-lite/issues/9169)) ([3e0f312](https://github.com/vega/vega-lite/commit/3e0f312f2f7f4e9ab4bc9c6ef1323c573edd3de0))

## [5.16.2](https://github.com/vega/vega-lite/compare/v5.16.1...v5.16.2) (2023-11-08)


### Bug Fixes

* **#9167:** make 1D bars respect orient for stack calculation ([#9168](https://github.com/vega/vega-lite/issues/9168)) ([432f354](https://github.com/vega/vega-lite/commit/432f3548323d72505f18e30e1e23d83718d3ad20)), closes [#9167](https://github.com/vega/vega-lite/issues/9167) [#9167](https://github.com/vega/vega-lite/issues/9167)

## [5.16.1](https://github.com/vega/vega-lite/compare/v5.16.0...v5.16.1) (2023-10-12)


### Bug Fixes

* support x/yOffset without x/y ([#9135](https://github.com/vega/vega-lite/issues/9135)) ([58294a7](https://github.com/vega/vega-lite/commit/58294a75745aaf160ad1034afd1a3a5d1a2ea81d))

# [5.16.0](https://github.com/vega/vega-lite/compare/v5.15.1...v5.16.0) (2023-10-09)


### Bug Fixes

* correct types for domain unionWith ([#9131](https://github.com/vega/vega-lite/issues/9131)) ([6f66759](https://github.com/vega/vega-lite/commit/6f667590d2f78093d53e513a6e4ae119810e12df))


### Features

* make bar & rect marks support bandPosition (allow center-alignment with ticks) ([#9126](https://github.com/vega/vega-lite/issues/9126)) ([bd014eb](https://github.com/vega/vega-lite/commit/bd014eb168060ae7f925dc0a927e7ca333a96c7b))
* swap 'mouse' events to 'pointer' events for mobile compatibility; update site and docs ([#9089](https://github.com/vega/vega-lite/issues/9089)) ([fa97659](https://github.com/vega/vega-lite/commit/fa97659e40ea340fa497783e4b32ef63ebe4bc3f))

## [5.15.1](https://github.com/vega/vega-lite/compare/v5.15.0...v5.15.1) (2023-10-02)


### Bug Fixes

* correct the formula for interpolating between bin start and end (interpolatedSignalRef) ([#9111](https://github.com/vega/vega-lite/issues/9111)) ([d4b27bb](https://github.com/vega/vega-lite/commit/d4b27bba1439dccab3dbf54f7c1af64155d8c7d5))
* use resolve "shared" instead of steps to fix artifacts in grouped density transform ([#9106](https://github.com/vega/vega-lite/issues/9106)) ([06e63e6](https://github.com/vega/vega-lite/commit/06e63e6bae3d4efa3d2041e6582415327ebdeb3b))

# [5.15.0](https://github.com/vega/vega-lite/compare/v5.14.1...v5.15.0) (2023-09-13)


### Bug Fixes

* unescape paths in binned `timeUnits` to allow for fields with periods in name ([#9088](https://github.com/vega/vega-lite/issues/9088)) ([53ede0e](https://github.com/vega/vega-lite/commit/53ede0e9e0e3195eab3a2a6a105020a74b913cba))
* update ts and fix typing issues ([#9066](https://github.com/vega/vega-lite/issues/9066)) ([b421a44](https://github.com/vega/vega-lite/commit/b421a445e68e43e563f02f1e6006e3f5d9434a2b))


### Features

* switch from clone to built in structured clone ([#9068](https://github.com/vega/vega-lite/issues/9068)) ([7874ea9](https://github.com/vega/vega-lite/commit/7874ea9396c2256bfd31307365da6fb5b6e66912))

## [5.14.1](https://github.com/vega/vega-lite/compare/v5.14.0...v5.14.1) (2023-07-20)


### Bug Fixes

* Area with plain quantitative fields on both axes get stacked by default ([#9018](https://github.com/vega/vega-lite/issues/9018)) ([b79bc9f](https://github.com/vega/vega-lite/commit/b79bc9fc3bc757b30aafd744d8ab3d679f85aedb))

# [5.14.0](https://github.com/vega/vega-lite/compare/v5.13.0...v5.14.0) (2023-07-20)


### Bug Fixes

* escape Quotes in tooltip `title` ([#9019](https://github.com/vega/vega-lite/issues/9019)) ([f7f7735](https://github.com/vega/vega-lite/commit/f7f77351d55a309b820406b4bfa90f0e11b13423))


### Features

* Improve color scheme type ([#9015](https://github.com/vega/vega-lite/issues/9015)) ([d535812](https://github.com/vega/vega-lite/commit/d5358127c8e8c097bba02a0cc9004676c576367f))

# [5.13.0](https://github.com/vega/vega-lite/compare/v5.12.0...v5.13.0) (2023-07-07)


### Features

* support domainRaw so one may bind domainRaw to a parameter to build custom interaction ([#8989](https://github.com/vega/vega-lite/issues/8989)) ([21c823d](https://github.com/vega/vega-lite/commit/21c823df1ce7c34f9f7a394f39501c5d8033bc49))

# [5.12.0](https://github.com/vega/vega-lite/compare/v5.11.1...v5.12.0) (2023-06-29)


### Features

* support pre-binned timeUnit ([#8971](https://github.com/vega/vega-lite/issues/8971)) ([dac5c19](https://github.com/vega/vega-lite/commit/dac5c199fe02f6fa73dfbdd6f9717224ffb81cf2))

## [5.11.1](https://github.com/vega/vega-lite/compare/v5.11.0...v5.11.1) (2023-06-26)


### Bug Fixes

* show gridline of first axis only for dual axes charts ([#8962](https://github.com/vega/vega-lite/issues/8962)) ([a522a87](https://github.com/vega/vega-lite/commit/a522a877ec79745e94f43fae8d0eeec9fbdc2e4b))

# [5.11.0](https://github.com/vega/vega-lite/compare/v5.10.0...v5.11.0) (2023-06-21)


### Bug Fixes

* make bin/timeUnit band respect minBandSize config ([#8958](https://github.com/vega/vega-lite/issues/8958)) ([d1c012e](https://github.com/vega/vega-lite/commit/d1c012e563a4e3dac3b95777257b6b613430fb00))


### Features

* config.rect/bar.minBandSize ([#8959](https://github.com/vega/vega-lite/issues/8959)) ([f541070](https://github.com/vega/vega-lite/commit/f5410708c2249d3e18d644f1f9cf760df3d8ec3d))

# [5.10.0](https://github.com/vega/vega-lite/compare/v5.9.3...v5.10.0) (2023-06-20)


### Bug Fixes

* make timeUnit band respect x2Offset ([#8956](https://github.com/vega/vega-lite/issues/8956)) ([f8a0cfa](https://github.com/vega/vega-lite/commit/f8a0cfae000d335e81a462f9a869552e3e465fe1))


### Features

* add `extent` transform ([#8940](https://github.com/vega/vega-lite/issues/8940)) ([85e5cc8](https://github.com/vega/vega-lite/commit/85e5cc84799824aab883cae52d9ccb10b73430ba))

## [5.9.3](https://github.com/vega/vega-lite/compare/v5.9.2...v5.9.3) (2023-05-18)


### Bug Fixes

* support stack bar with reverse order ([#8910](https://github.com/vega/vega-lite/issues/8910)) ([055e32f](https://github.com/vega/vega-lite/commit/055e32f2ce109c6a663c3950e6ad9f80b321f65b))

## [5.9.2](https://github.com/vega/vega-lite/compare/v5.9.1...v5.9.2) (2023-05-17)


### Bug Fixes

* make durationExpr work for week ([#8907](https://github.com/vega/vega-lite/issues/8907)) ([bf99571](https://github.com/vega/vega-lite/commit/bf995711ccb05fb27cfea8bab14fd419dadee503))
* respect bandWithNestedOffsetPaddingInner for grouped bar within discretized temporal axis ([#8906](https://github.com/vega/vega-lite/issues/8906)) ([9050e6b](https://github.com/vega/vega-lite/commit/9050e6bbb87ede9475040d57c13c49b18e364aea))

## [5.9.1](https://github.com/vega/vega-lite/compare/v5.9.0...v5.9.1) (2023-05-15)


### Bug Fixes

* handle falsy legend values in selections (take 2) ([#8895](https://github.com/vega/vega-lite/issues/8895)) ([fe599a2](https://github.com/vega/vega-lite/commit/fe599a2ab82f3a161d0df0f88f35eba9115d5e88))
* Make bars with one axis thicker ([#8894](https://github.com/vega/vega-lite/issues/8894)) ([309af9a](https://github.com/vega/vega-lite/commit/309af9ac314b5c83ecf89afbda6069a63fd7a53e))

# [5.9.0](https://github.com/vega/vega-lite/compare/v5.8.0...v5.9.0) (2023-05-05)


### Features

* allow custom tooltip formatting ([#8883](https://github.com/vega/vega-lite/issues/8883)) ([e7b45b8](https://github.com/vega/vega-lite/commit/e7b45b8ca0dd67915a8d8d962747f56de41a4cab))
* support grouped bars inside time axis with time bins ([#8874](https://github.com/vega/vega-lite/issues/8874)) ([b29fa64](https://github.com/vega/vega-lite/commit/b29fa64d2b06d424385d0ed7d9bb7163f73d5706))

# [5.8.0](https://github.com/vega/vega-lite/compare/v5.7.1...v5.8.0) (2023-05-01)


### Bug Fixes

* avoid repetitive labels by using tickMinStep ([#8872](https://github.com/vega/vega-lite/issues/8872)) ([0b1c385](https://github.com/vega/vega-lite/commit/0b1c3857b5ec538ad0acec3e21c9ed741b38135f))
* remove incorrect stack transform from charts with one linear Q-axis one non-linear Q-axis. ([#8871](https://github.com/vega/vega-lite/issues/8871)) ([f4d928a](https://github.com/vega/vega-lite/commit/f4d928a4e9f3272e0b24025e7243499d023dca76))


### Features

* enable ppi setting on png cli export ([#8854](https://github.com/vega/vega-lite/issues/8854)) ([d3a30bf](https://github.com/vega/vega-lite/commit/d3a30bf56397177f0764163c9ee37ca675d074f2))
* return error exit code for cli tools ([#8858](https://github.com/vega/vega-lite/issues/8858)) ([c3f1b8f](https://github.com/vega/vega-lite/commit/c3f1b8f35171c9f95ceed1cd26f3afe7825b98f2))
* simplify rollup script and update to more modern js ([#8852](https://github.com/vega/vega-lite/issues/8852)) ([b396595](https://github.com/vega/vega-lite/commit/b39659563a9e1d1d9418c3587c3fc8f696c5f165))
* update vega and other dependencies ([#8857](https://github.com/vega/vega-lite/issues/8857)) ([6a6da3b](https://github.com/vega/vega-lite/commit/6a6da3b85b58e2ae71d07f2b029d56c4a73c9171))

## [5.7.1](https://github.com/vega/vega-lite/compare/v5.7.0...v5.7.1) (2023-04-17)

# [5.7.0](https://github.com/vega/vega-lite/compare/v5.6.1...v5.7.0) (2023-04-15)


### Bug Fixes

* add repeat prefix to name in normalization ([#8733](https://github.com/vega/vega-lite/issues/8733)) ([2ea3265](https://github.com/vega/vega-lite/commit/2ea32651f9865311b25aa71f2da30277ea2a976e))
* allow setting width/height in repeated layers ([#8723](https://github.com/vega/vega-lite/issues/8723)) ([9e26410](https://github.com/vega/vega-lite/commit/9e264103dea45996b52ab8cdeb9be15254fc1bba))
* correctly apply stacked to bar with quantitative x and quantitative y axes ([#8838](https://github.com/vega/vega-lite/issues/8838)) ([4b9d22c](https://github.com/vega/vega-lite/commit/4b9d22c693860faf58c1868c0960b0b60405b504))
* correctly handle merging of domains with more than one sort object ([#8567](https://github.com/vega/vega-lite/issues/8567)) ([1eedb8f](https://github.com/vega/vega-lite/commit/1eedb8f31e35afb5e05fdacd8902448c2a9da706))
* move name from layer chart to one of the inside layers ([#8662](https://github.com/vega/vega-lite/issues/8662)) ([d99f614](https://github.com/vega/vega-lite/commit/d99f614cb322f9dd47c07af2cf02d6a3bfe36c9d))
* orient logic for when bar with x=T + simplify logic ([#8739](https://github.com/vega/vega-lite/issues/8739)) ([ea4aa64](https://github.com/vega/vega-lite/commit/ea4aa64644fbc31b0c9ee06cfde5660c04efe59b))
* prevent duplicate spec names in top-level selection view paths ([#8486](https://github.com/vega/vega-lite/issues/8486)) ([ba46bd2](https://github.com/vega/vega-lite/commit/ba46bd2b538be46686e90d8d6da032d160fac6e6))


### Features

* enable interval selections for cartographic projections ([#6953](https://github.com/vega/vega-lite/issues/6953)) ([e5cbe8f](https://github.com/vega/vega-lite/commit/e5cbe8f71e4d99f81c83ea1cbbc2938839cc8933))

## <small>5.6.1 (2023-02-13)</small>

* chore: require clean working dir and main for releases ([b9f15eb](https://github.com/vega/vega-lite/commit/b9f15eb))
* chore: switch to release-it ([4a02b5a](https://github.com/vega/vega-lite/commit/4a02b5a))
* chore: update lockfile ([bddc5d5](https://github.com/vega/vega-lite/commit/bddc5d5))
* chore: upgrade deps including rollup ([e757bfd](https://github.com/vega/vega-lite/commit/e757bfd))
* chore(deps-dev): bump @auto-it/conventional-commits from 10.38.5 to 10.42.0 (#8704) ([4797d48](https://github.com/vega/vega-lite/commit/4797d48)), closes [#8704](https://github.com/vega/vega-lite/issues/8704)
* chore(deps-dev): bump @auto-it/first-time-contributor from 10.38.5 to 10.42.0 (#8710) ([4912870](https://github.com/vega/vega-lite/commit/4912870)), closes [#8710](https://github.com/vega/vega-lite/issues/8710)
* chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.50.0 to 5.51.0 (#8705) ([0cbfb2b](https://github.com/vega/vega-lite/commit/0cbfb2b)), closes [#8705](https://github.com/vega/vega-lite/issues/8705)
* chore(deps-dev): bump @typescript-eslint/parser from 5.50.0 to 5.51.0 (#8706) ([3b8e8d8](https://github.com/vega/vega-lite/commit/3b8e8d8)), closes [#8706](https://github.com/vega/vega-lite/issues/8706)
* chore(deps-dev): bump auto from 10.38.5 to 10.42.0 (#8711) ([ebe2fbf](https://github.com/vega/vega-lite/commit/ebe2fbf)), closes [#8711](https://github.com/vega/vega-lite/issues/8711)
* chore(deps-dev): bump eslint from 8.33.0 to 8.34.0 (#8709) ([0ab6c0e](https://github.com/vega/vega-lite/commit/0ab6c0e)), closes [#8709](https://github.com/vega/vega-lite/issues/8709)
* chore(deps-dev): bump prettier from 2.8.3 to 2.8.4 (#8703) ([534cec1](https://github.com/vega/vega-lite/commit/534cec1)), closes [#8703](https://github.com/vega/vega-lite/issues/8703)
* chore(deps-dev): bump vega-datasets from 2.5.3 to 2.5.4 (#8707) ([c64cf94](https://github.com/vega/vega-lite/commit/c64cf94)), closes [#8707](https://github.com/vega/vega-lite/issues/8707)
* chore(deps-dev): bump vega-embed from 6.21.0 to 6.21.2 (#8712) ([59c0650](https://github.com/vega/vega-lite/commit/59c0650)), closes [#8712](https://github.com/vega/vega-lite/issues/8712)



## 5.6.0 (2022-10-14)

* Bump version to: 5.6.0 [skip ci] ([1ff500a](https://github.com/vega/vega-lite/commit/1ff500a))
* Update CHANGELOG.md [skip ci] ([71a7e87](https://github.com/vega/vega-lite/commit/71a7e87))



## 5.5.0 (2022-08-15)

* Bump version to: 5.5.0 [skip ci] ([0a2b57f](https://github.com/vega/vega-lite/commit/0a2b57f))
* Update CHANGELOG.md [skip ci] ([6562bea](https://github.com/vega/vega-lite/commit/6562bea))

# v5.6.0 (Fri Oct 14 2022)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Lam Thien Toan ([@danielmalaton](https://github.com/danielmalaton))

:heart: Brandon Hamilton ([@mistidoi](https://github.com/mistidoi))

:heart: null[@sl-solution](https://github.com/sl-solution)

:heart: Zachary Bys ([@ZacharyBys](https://github.com/ZacharyBys))

#### 🚀 Enhancement

- feat: remove flatmap polyfill [#8434](https://github.com/vega/vega-lite/pull/8434) ([@domoritz](https://github.com/domoritz))
- feat: Allow config to set default scale.zero per marktype [#8354](https://github.com/vega/vega-lite/pull/8354) ([@yhoonkim](https://github.com/yhoonkim) vega-actions-bot@users.noreply.github.com)

#### 🐛 Bug Fix

- fix: Init the better orient for the ranged bar [#8475](https://github.com/vega/vega-lite/pull/8475) ([@yhoonkim](https://github.com/yhoonkim))
- fix: Remove x2/y2 channels for overlaying line and point [#8472](https://github.com/vega/vega-lite/pull/8472) ([@yhoonkim](https://github.com/yhoonkim))
- chore(deps-dev): bump @rollup/plugin-babel from 5.3.1 to 6.0.0 [#8455](https://github.com/vega/vega-lite/pull/8455) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- fix: update contributing.md [#8470](https://github.com/vega/vega-lite/pull/8470) ([@kanitw](https://github.com/kanitw))
- fix: try to see if `fix:` without scope triggers shipit for #8451 [#8468](https://github.com/vega/vega-lite/pull/8468) ([@kanitw](https://github.com/kanitw))
- chore(deps-dev): bump @rollup/plugin-commonjs from 22.0.2 to 23.0.0 [#8456](https://github.com/vega/vega-lite/pull/8456) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @rollup/plugin-alias from 3.1.9 to 4.0.0 [#8462](https://github.com/vega/vega-lite/pull/8462) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.38.1 to 5.39.0 [#8463](https://github.com/vega/vega-lite/pull/8463) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ts-jest from 29.0.2 to 29.0.3 [#8445](https://github.com/vega/vega-lite/pull/8445) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump terser from 5.15.0 to 5.15.1 [#8464](https://github.com/vega/vega-lite/pull/8464) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-plugin-jest from 27.0.4 to 27.1.1 [#8457](https://github.com/vega/vega-lite/pull/8457) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump vega-datasets from 2.5.1 to 2.5.3 [#8458](https://github.com/vega/vega-lite/pull/8458) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.24.0 to 8.25.0 [#8459](https://github.com/vega/vega-lite/pull/8459) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.38.1 to 5.39.0 [#8460](https://github.com/vega/vega-lite/pull/8460) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.19.1 to 7.19.3 [#8437](https://github.com/vega/vega-lite/pull/8437) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump yargs from 17.5.1 to 17.6.0 [#8439](https://github.com/vega/vega-lite/pull/8439) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump typescript from 4.8.3 to 4.8.4 [#8436](https://github.com/vega/vega-lite/pull/8436) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.38.0 to 5.38.1 [#8438](https://github.com/vega/vega-lite/pull/8438) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.38.0 to 5.38.1 [#8440](https://github.com/vega/vega-lite/pull/8440) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ts-json-schema-generator from 1.1.1 to 1.1.2 [#8442](https://github.com/vega/vega-lite/pull/8442) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.19.1 to 7.19.3 [#8443](https://github.com/vega/vega-lite/pull/8443) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump vega-datasets from 2.4.0 to 2.5.1 [#8444](https://github.com/vega/vega-lite/pull/8444) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- docs: typo error [#8391](https://github.com/vega/vega-lite/pull/8391) ([@danielmalaton](https://github.com/danielmalaton))
- chore(deps-dev): bump ts-jest from 29.0.1 to 29.0.2 [#8428](https://github.com/vega/vega-lite/pull/8428) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.23.1 to 8.24.0 [#8429](https://github.com/vega/vega-lite/pull/8429) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump codecov/codecov-action from 3.1.0 to 3.1.1 [#8430](https://github.com/vega/vega-lite/pull/8430) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- docs: fix typo in "Dot Plot with Jittering" example [#8426](https://github.com/vega/vega-lite/pull/8426) ([@sl-solution](https://github.com/sl-solution))
- chore: upgrade deps [#8424](https://github.com/vega/vega-lite/pull/8424) ([@domoritz](https://github.com/domoritz))
- chore(deps): bump commonmarker from 0.23.5 to 0.23.6 in /site [#8422](https://github.com/vega/vega-lite/pull/8422) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.37.4 to 10.37.6 [#8415](https://github.com/vega/vega-lite/pull/8415) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.19.0 to 7.19.1 [#8416](https://github.com/vega/vega-lite/pull/8416) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.36.2 to 5.37.0 [#8418](https://github.com/vega/vega-lite/pull/8418) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @rollup/plugin-node-resolve from 14.0.1 to 14.1.0 [#8413](https://github.com/vega/vega-lite/pull/8413) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.37.4 to 10.37.6 [#8414](https://github.com/vega/vega-lite/pull/8414) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.19.0 to 7.19.1 [#8417](https://github.com/vega/vega-lite/pull/8417) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.36.2 to 5.37.0 [#8419](https://github.com/vega/vega-lite/pull/8419) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.37.4 to 10.37.6 [#8420](https://github.com/vega/vega-lite/pull/8420) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- docs: fix typo in 1:1 mapping caveat in scale documentation [#8410](https://github.com/vega/vega-lite/pull/8410) ([@mistidoi](https://github.com/mistidoi))
- chore(deps-dev): bump @rollup/plugin-node-resolve from 13.3.0 to 14.0.1 [#8407](https://github.com/vega/vega-lite/pull/8407) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.36.1 to 5.36.2 [#8402](https://github.com/vega/vega-lite/pull/8402) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.18.10 to 7.19.0 [#8403](https://github.com/vega/vega-lite/pull/8403) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-plugin-jest from 27.0.1 to 27.0.4 [#8400](https://github.com/vega/vega-lite/pull/8400) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.23.0 to 8.23.1 [#8401](https://github.com/vega/vega-lite/pull/8401) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump typescript from 4.8.2 to 4.8.3 [#8404](https://github.com/vega/vega-lite/pull/8404) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.36.1 to 5.36.2 [#8405](https://github.com/vega/vega-lite/pull/8405) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.18.13 to 7.19.0 [#8406](https://github.com/vega/vega-lite/pull/8406) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.35.1 to 5.36.1 [#8396](https://github.com/vega/vega-lite/pull/8396) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.35.1 to 5.36.1 [#8398](https://github.com/vega/vega-lite/pull/8398) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump rollup from 2.78.1 to 2.79.0 [#8399](https://github.com/vega/vega-lite/pull/8399) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- docs: remove redundant word [#8392](https://github.com/vega/vega-lite/pull/8392) ([@danielmalaton](https://github.com/danielmalaton))
- fix: Set package.json version to 5.5.0 (re-sync with stable) [#8388](https://github.com/vega/vega-lite/pull/8388) ([@hydrosquall](https://github.com/hydrosquall))
- chore(deps-dev): bump eslint-plugin-jest from 26.8.7 to 27.0.1 [#8387](https://github.com/vega/vega-lite/pull/8387) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.33.1 to 5.35.1 [#8383](https://github.com/vega/vega-lite/pull/8383) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.22.0 to 8.23.0 [#8381](https://github.com/vega/vega-lite/pull/8381) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.18.10 to 7.18.13 [#8382](https://github.com/vega/vega-lite/pull/8382) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.33.1 to 5.35.1 [#8384](https://github.com/vega/vega-lite/pull/8384) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump typescript from 4.7.4 to 4.8.2 [#8385](https://github.com/vega/vega-lite/pull/8385) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump terser from 5.14.2 to 5.15.0 [#8386](https://github.com/vega/vega-lite/pull/8386) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(release): bump package.json version to v5.6.0 [#8378](https://github.com/vega/vega-lite/pull/8378) ([@hydrosquall](https://github.com/hydrosquall))
- chore(deps-dev): bump @typescript-eslint/parser from 5.33.0 to 5.33.1 [#8375](https://github.com/vega/vega-lite/pull/8375) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump rollup from 2.78.0 to 2.78.1 [#8372](https://github.com/vega/vega-lite/pull/8372) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-plugin-jest from 26.8.2 to 26.8.7 [#8373](https://github.com/vega/vega-lite/pull/8373) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.33.0 to 5.33.1 [#8376](https://github.com/vega/vega-lite/pull/8376) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- fix: first interaction workflow yml [#8369](https://github.com/vega/vega-lite/pull/8369) ([@lsh](https://github.com/lsh))
- ci: update contribution information [#8367](https://github.com/vega/vega-lite/pull/8367) ([@lsh](https://github.com/lsh))
- docs: update selection toggle to conform with point selection behavior [#8270](https://github.com/vega/vega-lite/pull/8270) ([@arvind](https://github.com/arvind) vega-actions-bot@users.noreply.github.com)

#### Authors: 12

- [@dependabot[bot]](https://github.com/dependabot[bot])
- [@sl-solution](https://github.com/sl-solution)
- Arvind Satyanarayan ([@arvind](https://github.com/arvind))
- Brandon Hamilton ([@mistidoi](https://github.com/mistidoi))
- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))
- Dominik Moritz ([@domoritz](https://github.com/domoritz))
- GitHub Actions Bot (vega-actions-bot@users.noreply.github.com)
- Kanit Wongsuphasawat ([@kanitw](https://github.com/kanitw))
- Lam Thien Toan ([@danielmalaton](https://github.com/danielmalaton))
- Lukas Hermann ([@lsh](https://github.com/lsh))
- Younghoon Kim ([@yhoonkim](https://github.com/yhoonkim))
- Zachary Bys ([@ZacharyBys](https://github.com/ZacharyBys))

---

# v5.5.0 (Mon Aug 15 2022)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: fish ([@fish-404](https://github.com/fish-404))

:heart: Jon Mease ([@jonmmease](https://github.com/jonmmease))

:heart: Dan Marshall ([@danmarshall](https://github.com/danmarshall))

#### 🚀 Enhancement


#### 🐛 Bug Fix

- ci: Use Pull Request Head Ref [#8363](https://github.com/vega/vega-lite/pull/8363) ([@lsh](https://github.com/lsh))
- ci: split scripts and refine triggers [#8356](https://github.com/vega/vega-lite/pull/8356) ([@domoritz](https://github.com/domoritz))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.32.0 to 5.33.0 [#8357](https://github.com/vega/vega-lite/pull/8357) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-plugin-jest from 26.8.0 to 26.8.2 [#8358](https://github.com/vega/vega-lite/pull/8358) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.21.0 to 8.22.0 [#8359](https://github.com/vega/vega-lite/pull/8359) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump rollup from 2.77.2 to 2.78.0 [#8360](https://github.com/vega/vega-lite/pull/8360) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.32.0 to 5.33.0 [#8361](https://github.com/vega/vega-lite/pull/8361) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- docs: add MarkText to Vega-Lite ecosystem [#8283](https://github.com/vega/vega-lite/pull/8283) ([@fish-404](https://github.com/fish-404) [@domoritz](https://github.com/domoritz))
- ci: simplify setup and use caching [#8355](https://github.com/vega/vega-lite/pull/8355) ([@domoritz](https://github.com/domoritz))
- docs: add heat lane example [#8353](https://github.com/vega/vega-lite/pull/8353) ([@jonmmease](https://github.com/jonmmease) vega-actions-bot@users.noreply.github.com [@domoritz](https://github.com/domoritz))
- docs: Explicit temporal type [#8352](https://github.com/vega/vega-lite/pull/8352) ([@danmarshall](https://github.com/danmarshall) [@domoritz](https://github.com/domoritz))
- fix: fix thin bar problem (#8350) [#8349](https://github.com/vega/vega-lite/pull/8349) ([@kanitw](https://github.com/kanitw) vega-actions-bot@users.noreply.github.com)
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.31.0 to 5.32.0 [#8340](https://github.com/vega/vega-lite/pull/8340) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.18.9 to 7.18.10 [#8341](https://github.com/vega/vega-lite/pull/8341) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/chai from 4.3.1 to 4.3.3 [#8343](https://github.com/vega/vega-lite/pull/8343) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.31.0 to 5.32.0 [#8344](https://github.com/vega/vega-lite/pull/8344) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-plugin-jest from 26.7.0 to 26.8.0 [#8345](https://github.com/vega/vega-lite/pull/8345) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.18.9 to 7.18.10 [#8346](https://github.com/vega/vega-lite/pull/8346) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @rollup/plugin-commonjs from 22.0.1 to 22.0.2 [#8347](https://github.com/vega/vega-lite/pull/8347) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- feat: Add `timeFormatType` field [#8320](https://github.com/vega/vega-lite/pull/8320) ([@lsh](https://github.com/lsh) vega-actions-bot@users.noreply.github.com)
- chore(deps-dev): bump del-cli from 4.0.1 to 5.0.0 [#8313](https://github.com/vega/vega-lite/pull/8313) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.30.7 to 5.31.0 [#8330](https://github.com/vega/vega-lite/pull/8330) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump rollup from 2.77.0 to 2.77.2 [#8334](https://github.com/vega/vega-lite/pull/8334) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.37.3 to 10.37.4 [#8335](https://github.com/vega/vega-lite/pull/8335) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.37.3 to 10.37.4 [#8336](https://github.com/vega/vega-lite/pull/8336) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.20.0 to 8.21.0 [#8329](https://github.com/vega/vega-lite/pull/8329) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.37.3 to 10.37.4 [#8331](https://github.com/vega/vega-lite/pull/8331) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.30.7 to 5.31.0 [#8332](https://github.com/vega/vega-lite/pull/8332) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-plugin-jest from 26.6.0 to 26.7.0 [#8333](https://github.com/vega/vega-lite/pull/8333) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- ci: set up node before running yarn and use caching everywhere [#8328](https://github.com/vega/vega-lite/pull/8328) ([@domoritz](https://github.com/domoritz))

#### Authors: 8

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Dan Marshall ([@danmarshall](https://github.com/danmarshall))
- Dominik Moritz ([@domoritz](https://github.com/domoritz))
- fish ([@fish-404](https://github.com/fish-404))
- GitHub Actions Bot (vega-actions-bot@users.noreply.github.com)
- Jon Mease ([@jonmmease](https://github.com/jonmmease))
- Kanit Wongsuphasawat ([@kanitw](https://github.com/kanitw))
- Lukas Hermann ([@lsh](https://github.com/lsh))
