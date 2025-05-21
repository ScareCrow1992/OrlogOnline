
class Storage():
    def __init__(self, id):
        self.id = id
        self.actions = []
        self.critics = []
        self.masked_actions = []

    def Save(self, action_, critic_, masked_action_):
        self.actions.append(action_)
        self.critics.append(critic_)
        self.masked_actions.append(masked_action_)


    def Load(self):
        return self.actions, self.critics, self.masked_actions
