class EarlyStopping:
    def __init__(self, patience=None, min_delta=0):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.min_validation_loss = float('inf')

    def early_stop(self, validation_loss):
        if self.patience is None:
            return False
        
        if validation_loss < self.min_validation_loss:
            self.counter = 0
            print(f'    Validation loss decreased ({self.min_validation_loss:.4f} --> {validation_loss:.4f}). Resetting counter to 0. New threshold is {validation_loss + self.min_delta:.4f}')
            
            self.min_validation_loss = validation_loss
        elif validation_loss >= (self.min_validation_loss + self.min_delta):
            self.counter += 1
            if self.counter >= self.patience:
                return True
        
        return False