import { createMachine } from "xstate";

/**
 * Message Domain Entity
 *
 * Messages are the core of the application. They are the main entity that is
 * carries the core business logic of communication between agents through
 * conversations.
 *
 * @xstate-config N4IgpgJg5mDOIC5QFs6wIYwHQEsB2OALjugDY4BekAxAMYBOY6hYA2gAwC6ioADgPawiOfnh4gAHogCMADgCsWefIAsANlnsVAZgBM22erUAaEAE9E86eywqAnA4Ds2+Y7UrrugL5fTqWBjY+MJklDS0pKJsXOICQsSi4lIIcorK6po6+oZqJuaIKvJ2WA4OstJ2jp52rj5+aJhguATEoVQQ1IyE9DhgAG7R3EggccKJw8mpSqoaWnoGRqYWCNqOuliyjvZqRVba0o7OdSD+gU3BreTtnXCE-IwcQ3yCY2ITMgrTGXPZi-kI5SU7GB0lUKkM8jUx1OjSwDCYLA6fVCEGYg1iLwSb1AyR02hKukq7DcukcWnUS0s7Hxunsdg0hi29m00Ia2C6PX6NAArrxUSxHhj4iJsZICtp8XZCWSSWSVBT-gZ1nSakZ2JC1FtWQFYRzegMOhAwKQwAKYsNRlikuLJdLiWpSeS8stdGppCVSg6VM5gXYVNqzlg9VyOuh6LQABY4AaCi2YkXWhB4glE2VOykIXTsda00q6WS5VXEgOw5Hkfk0XhgehCWCEWPPYXjHEyOQ2KqbB3E6TgtwZpW2UozNTq3Ja3wnNlNXkVpEotENkbx5tigH6D26HsKFTAgvSfuyZVDtUa8f1HXYMOR6M0Rh1+7ouNN0XJOW2EdSke
 */
const messageMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFs6wIYwHQEsB2OALjugDY4BekAxANoAMAuoqAA4D2sRO7eLIAD0QBGAGwBWLONEAmcfRmiAzOLn1hAGhABPRAA5hU+sZkzhAFmmjhAdhkBfe1tSwM2fNzKUatYcyQgHFzEvPxCCGKS0mqKKmqaOiIyNkbG9OLCwgbmWTaOzmiYYLgExF5UEHQy-myc3KEB4ZFSsvKxqvIJugjmMuZY9KJDSnpKYxIAnHlOIC5uxQDGAE5g6IQ0AG5eEGtgDDWBdSF8jYg2Q1I22emi5vRK5jZa3UoSWBNiovQT9DY2E3clPlZoVsCtCEscGANjQFqReHsmPwgvUTqBwuYJpIzHp-mZHsIFKJnoglDYlFhPso7ENxOcZECZnMilhwZDoTQAK6sHbrfbIo48NGCRCY7G5Cb4myExQkhBfeiU2l6ei9UTnUQTYHMsFgCFQmGVCBgUh6xEHFHHMKirFYHF4izSoly3qSIZDcm2cwjW6ibWg4psg00dBLBYACxwMP5AUtQutPVt9sljplxMSCD6kgmOZzQ1VI2EEz0-tcLK25F5NFYYCWXFghBjtWC8dOET6eiw5O9egmZMlyXMcoZKQ++d6j1+dIcTIDWArOCrlRrdZwDd8FsFDXRSXMne7Iz7eMHLv+WByw3M1mLNg6pfmWG5S+oC6rTcOLe3Ioiyn63ps5iYv8-wSEOGYqJ27riBMyiDFMMglrOZbYKGEZRjQKwNuwKzvnGX7hBqlzXNIgKPMOlhKu6SjJISe5DPeLKoZGhrUCu9aNkisZbsKBEXHSxG3PcZEZpkKRUsI9q2Ho9FIQ+mGENhmzbLsuHcQmhIKOeZLiNB0hXL+5GSFSyg0aq0l+rJLK1ksimVE+Kmcc2qLqb+WkAUBUwweIYHdI8Eznp8DzXrid7Ang7DGvAAQ6mAAqfjxiAALTpt0yUDGkGWZSo4gMe4pQkOQFRxc5ba9HKEmSABObZLYxamMIuWLCsuwQMVVptsohjiHoeh0g8whjN8Exyq8ogBeq6jdUoWKEtMBTIYGersoabWtjuCCvJVMG9tRgGqsI4guqYWBKJ8eh3ANxgGI187KesrVcfF6kSTIWC9QCqinVkQx6CN0GUdBsGanYiHzQ+bFrvdq34SIjySCFV0-A85zDjI-mYjmmKmHcIUzmDLL2VDj0letti3G90HevIfn-L9GbQYY+3SBJNj3Adc0ggtWDGqaRNOe162yIYV49QoJEKAhR39GO0GnVM3bmDdTHoQ9-Nrd+ygUrYWSeTj51PBmDL+X0uaShk9B6GjOWWbqWErKrH4k9+PVjabuLpPIYyGVg7rDKZdEWfj2DWbZ0MJREmKdr2gxZBb3mDIdGZ+e8gVXkWuPW44QA */
  types: {
    context: {} as {
      id: string;
      content: string;
    },
    input: {} as {
      id: string;
      content: string;
    },
    events: {} as
      | { type: "create" }
      | { type: "clone" }
      | { type: "retrieve" }
      | { type: "validate" }
      | { type: "persist" }
      | { type: "update" }
      | { type: "delete" }
      | { type: "archive" }
      | { type: "restore" }
      | { type: "error" },
  },
  id: "message",
  context: ({ input }) => ({ ...input }),
  initial: "initialized",
  states: {
    initialized: {
      always: [
        {
          target: "archived",
          guard: "isArchived",
          // @ts-expect-error the visual editor doesn't support the `guard` property yet
          cond: "isArchived",
        },
        {
          target: "created",
          guard: "isNew",
          // @ts-expect-error the visual editor doesn't support the `guard` property yet
          cond: "isNew",
        },
        {
          target: "retrieved",
          guard: "isPersisted",
          // @ts-expect-error the visual editor doesn't support the `guard` property yet
          cond: "isPersisted",
        },
      ],
    },
    created: {
      on: {
        validate: "validated",
      },
    },
    retrieved: {
      on: {
        clone: "created",
        update: "updated",
        delete: "deleted",
        archive: "archived",
      },
    },
    validated: {
      on: {
        persist: [
          {
            target: "persisted",
            guard: "isValid",
            // @ts-expect-error the visual editor doesn't support the `guard` property yet
            cond: "isValid",
          },
          {
            target: "errored",
          },
        ],
      },
    },
    persisted: {
      type: "final",
    },
    updated: {
      on: {
        validate: "validated",
      },
    },
    deleted: {
      type: "final",
    },
    archived: {
      on: {
        restore: "restored",
        persist: "persisted",
      },
    },
    restored: {
      on: {
        validate: "validated",
      },
    },
    errored: {
      on: {
        update: "updated",
      },
    },
  },
});

export default messageMachine;
