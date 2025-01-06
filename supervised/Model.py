from torch import nn

class Model(nn.Module):
    def __init__(self, num_planes=19, board_size=8, num_actions: int = None):
        super(Model, self).__init__()
        
        # Convolutional layers
        self.conv1 = nn.Conv2d(num_planes, 64, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu1 = nn.ReLU()
        
        self.conv2 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(128)
        self.relu2 = nn.ReLU()
        
        self.conv3 = nn.Conv2d(128, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        self.relu3 = nn.ReLU()
        
        # Fully connected layers
        self.fc1 = nn.Linear(128 * board_size * board_size, 512)
        self.fc_relu1 = nn.ReLU()
        self.fc2 = nn.Linear(512, num_actions)
    
    def forward(self, x):
        # Convolutional layers with ReLU and BatchNorm
        x = self.relu1(self.bn1(self.conv1(x)))
        x = self.relu2(self.bn2(self.conv2(x)))
        x = self.relu3(self.bn3(self.conv3(x)))
        
        # Flatten for fully connected layers
        x = x.view(x.size(0), -1)  # Batch size x Flattened features
        
        # Fully connected layers
        x = self.fc_relu1(self.fc1(x))
        x = self.fc2(x)
        
        return x