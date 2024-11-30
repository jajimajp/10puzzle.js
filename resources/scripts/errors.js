/** Errors supports both English & Japanese representations. */

export class ErrorI18n extends Error {
  constructor(msgEn, msgJa) {
    super();
    this.message = msgEn;
    this.messageJa = msgJa;
  }
}

