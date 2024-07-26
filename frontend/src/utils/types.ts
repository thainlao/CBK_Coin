export interface ITasks {
    _id: string;
    img: string;
    title: string;
    task_text: string;
    status: Status;
    reward: number;
    link?: string;
}

export type Status = 'done' | 'claim' | 'blocked' | 'open';

export interface Iprops {
    singleTask: ITasks;
}

export interface ISingleTaskProps {
    singleTask: ITasks;
    telegramId: string;
}

export interface IFriend {
    _id: string;
    friendavatar: string;
    friendName: string;
    friendFriends: number;
    firendCBK: number;
}

export interface IUserData {
    _id: string;
    telegramId: string;
    username: string;
    cbkCoins: number;
    friends: IFriend[];
    lastCollected: Date;
    referrer: any;
    referralLink: string;
    tasks: ITasks[];
}

export interface UserDataProps {
    userData: IUserData | null;
    activeComponent: any
}

export interface baseProps {
    userData: IUserData | null;
    canCollect: boolean;
    activeComponent: any
    nextAvailableTime: Date | null;
    checkCollectionStatus: (telegramId: string) => void;
}