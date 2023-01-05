import * as Effect from "@effect/io/Effect"
import * as Fiber from "@effect/io/Fiber"
import * as TestRuntime from "@effect/test/Runtime"
import * as TestClock from "@effect/test/TestClock"
import * as Duration from "@fp-ts/data/Duration"
import { pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"
import * as assert from "node:assert"

const program = Effect.gen(function*($) {
  const fiber = yield* $(pipe(
    Effect.sleep(Duration.minutes(5)),
    Effect.timeout(Duration.minutes(1)),
    Effect.fork
  ))
  yield* $(TestClock.adjust(Duration.minutes(1)))
  const result = yield* $(Fiber.join(fiber))
  assert.deepStrictEqual(result, Option.none)
})

TestRuntime.unsafeRun(program, (exit) => {
  console.log(exit)
})
