interface EmailInfo {
    id: number,
    sender: string,
    recipients: string[],
    subject: string,
    body: string,
    timestamp: string,
    read: boolean,
    archived: boolean,
}

interface SendEmailData {
    recipients: string,
    subject: string,
    body: string,
}

interface ChangeEmailStatusData {
    read?: boolean,
    archived?: boolean,
}

interface SendEmailResponse {
    message: string,
}

interface ErrorResponse {
    error: string,
}

interface CreateElementArgs {
    text?: string,
    classes?: string[],
}

interface CreateTableRowArgs {
    rowClasses?: string[],
    headers?: CreateElementArgs[],
    cells?: CreateElementArgs[],
}

type MailboxType = "inbox" | "sent" | "archive";

type PotentialErrorResponse<T> = T | ErrorResponse | undefined;
