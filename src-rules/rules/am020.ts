"use strict";

import { ErrorContext, FilterParams } from "../shared";

export const am020 = {
  names: ["AM020", "metadata-values"],
  description: "Invalid Metadata - deprecated",
  tags: ["link"],
  function: function AM0020(
    params: FilterParams,
    onError: (context: ErrorContext) => void
  ) {
    // handled in packaging now
    return;
  },
};
