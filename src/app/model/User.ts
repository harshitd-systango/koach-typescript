export class UserModel {
    id: string
    firstName: string
    lastName: string
    userName: string
    email : string
    password: string
    profilePicUrl: string
    bio: string
    isVerified: boolean

    constructor() {
        this.id = null
        this.firstName = null
        this.lastName = null
        this.userName = null
        this.email = null
        this.password = null
        this.profilePicUrl = null
        this.bio = null
        this.isVerified
    }
    
    setId(id: string) {
        this.id = id
    }

    setFirstName(firstName: string) {
        this.firstName = firstName
    }

    setLastName(lastName: string) {
        this.lastName = lastName
    }

    setUserName(userName: string) {
        this.userName = userName
    }

    setEmail(email: string) {
        this.email = email
    }

    setPassword(password: string) {
        this.password = password
    }

    setProfilePicUrl(profilePicUrl: string) {
        this.profilePicUrl = profilePicUrl
    }

    setBio(bio: string) {
        this.bio = bio
    }

    setisVerified(isVerified: boolean) {
        this.isVerified = isVerified
    }

    getId(): string {
        return this.id
    }

    getFirstName(): string {
        return this.firstName
    }

    getLastName(): string {
        return this.lastName
    }

    getUserName(): string {
        return this.userName
    }

    getEmail(): string {
        return this.email
    }

    getpassword(): string {
        return this.password
    }

    getProfilePicUrl(): string {
        return this.profilePicUrl
    }

    getBio(): string {
        return this.bio
    }

    getIsVerified(): boolean {
        return this.isVerified
    }
}