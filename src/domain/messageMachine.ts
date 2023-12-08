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
  /** @xstate-layout N4IgpgJg5mDOIC5QFs6wIYwHQEsB2OALjugDY4BekAxAMYBOY6hYA2gAwC6ioADgPawiOfnh4gAHogCMADgCsWefIAsANlkqAnACZ5AdnnsVAGhABPRPOnss2rVuk7n0gMwrNAX09nUsDNj4wmSUNLSkomxc4gJCxKLiUghyisrqmroGRqYWiCryWlgODq7ssuyuamr53r5omGC4BMQhVBDUjIT0OGAAblHcSCCxwglDSSlKqhraeobGZpYIrvo6WLL62gVqro7yu7UgfgGNQS3kbR1whPyMHIN8gqNi4zIKU+mzWQu5CLLSSnYQJs8h0Wk0ai0+kOxwaWAYTBY7V6IQgzAGMSe8ReoCSKlcriKYLU1iqWgJPyWRkJOns+X07Fp0khMPq2E63T6NAArrw0Sx7pi4iIcZI8gSiVoSczIRScktXLI1kYgeppPk1M4dGpWf44Ryev12hAwKQwALokMRtjEuLCbopaTZaV5YhtQDilojBo9CppLqTlgDVz2uh6LQABY4fqCq1YkW2hD4+3Ep3kl2LN2MrB6IHsJyKjSyXQBuEo8j8mi8MD0ISwQixx7Csa4mRyWz6OSa5wkilaTPLJWA1VqdXybva0vYXmV5Go9GN4bxltiv46e26MdaDwqHTsNQDxXKvNqjVanU+I5sxphyPRmiMeu3DFx5uipIMlR2NTsLS-2TuNI4IDnuay5sC66yEWJaXrC7LXM+c4VgulpNs8ibkoUu7SPo+hVH625OAOQGKHmqoEgYfoXpeeD8Ca8BDHBYBCuhrwIAAtAevzsYonp8Z6+haFOpzNCQFyQCxNpsbuA72HY9g7Cse5ksJ8KMOiECSQmbGlGoWDsKsf6uMy0jbNIA7UlgmwOBBOzkv6sHXkG5qckaWkrkkLpKKZmpKsoBI7Poh76ISKwqqCpk4YY0KOXq2Dljgs7ue+MjsAU6z4iShHqsZ-a-EeRTFKoJSUUJsWBtWtY4PWEmvqxrbJGCX75qozjbioqzyIe-xWXSbiOEeXqqTOGnJYmn7fr+-6AcB+VDp6xXkqVqkmmaSJjWxaRYK41j7Co+KyEqv4gaOOb2EqJKBTosiqbeUZuXVUkNeOelpeo1TMr6h0gdm8wQYWh0wXUcWNI+NyMJpj3aQ1SobjoW47spxFesO5E7ZszLeN4QA */
  types: {} as {
    context: {
      id: string;
      content: string;
    };
    input: {
      id: string;
      content: string;
    };
    events:
      | { type: "create" }
      | { type: "clone" }
      | { type: "retrieve" }
      | { type: "validate" }
      | { type: "persist" }
      | { type: "update" }
      | { type: "delete" }
      | { type: "archive" }
      | { type: "restore" }
      | { type: "error" };
    states: {
      initialized: object;
      created: object;
      retrieved: object;
      validated: object;
      persisted: object;
      updated: object;
      deleted: object;
      archived: object;
      restored: object;
      errored: object;
    };
  },
  id: "message",
  context: ({ input }) => ({ ...input }),
  initial: "initialized",
  states: {
    initialized: {
      on: {
        create: "created",
        clone: "created",
        retrieve: "retrieved",
        restore: "restored",
      },
    },
    created: {
      on: {
        validate: "validated",
      },
    },
    retrieved: {
      on: {
        update: "updated",
        delete: "deleted",
        archive: "archived",
      },
    },
    validated: {
      on: {
        persist: "persisted",
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
      },
    },
    restored: {
      on: {
        validate: "validated",
      },
    },
  },
});

export default messageMachine;
