import type { SyntheticEvent } from 'react';

/**
 * Submit event of a `<form>`: React's synthetic wrapper around the DOM
 * `SubmitEvent`, so `event.nativeEvent` is typed (`submitter`, etc.).
 */
export type FormSubmitEvent = SyntheticEvent<HTMLFormElement, SubmitEvent>;
